import { TextEditorEvent, Key, Tool, KeyboardEventEnum, ComponentPosition } from "./enums";
import { focusedComponent, lastTextEditorEvent, isShiftPressed } from "../utils/store";
import type { ComponentEventData, ComponentProps } from "./interfaces";
import { compute_rest_props, debug, text } from "svelte/internal";
import { get } from 'svelte/store';


function foo(model: { property1: number; property2: number }) {
    model.property1++;
    model.property2++;

    // Not needed but
    // considered good practice.
    return model;
}

export const setFocusOnNode = (model: { props: ComponentProps }) => {
    model.props.afterMount.mainNode.focus();
    return model;
}

export const updateFocusNodeInStore = (model: { props: ComponentProps }) => {
    focusedComponent.set({
        id: model.props.id,
        type: model.props.type,
    });
    return model;
}

export const dispatchTextEditorEvent = (model: { props: ComponentProps, event: TextEditorEvent, eventRef: any }) => {

    let eData: ComponentEventData = {
        event: model.event,
        id: model.props.id,
        type: model.props.type,
        eventRef: model.eventRef,
        props: model.props,
    }

    //console.log(`Dispatching : ${eData.event} -> ${eData.id}`);
    model.props.afterMount.eventDispatcher("message", eData);
    return model;
};

export const onKeyboardEventEnum = (model: { props: ComponentProps, event: any, KeyboardEventEnum: KeyboardEventEnum, isEmpty: boolean }) => {
    let keyCode = model.event.code;
    let isCtrlKey = model.event.ctrlKey;
    let isShiftKey = model.event.shiftKey;
    let isTextEmpty = model.isEmpty;
    let modelKeyboardEventEnum = model.KeyboardEventEnum;

    if (isShiftKey) updateStore_isShiftPressed(modelKeyboardEventEnum);

    if (isUnwantedKeyboardEventEnum(keyCode, modelKeyboardEventEnum)) return;

    if (isTextEditorEvent(isCtrlKey, keyCode)) {
        let editorEvent = resolveTextEditorEvent(isShiftKey, isCtrlKey, isTextEmpty, keyCode);
        if (editorEvent === TextEditorEvent.Typing) return;
        model.props.afterMount.isSelected = true;
        model.event.preventDefault();
        dispatchTextEditorEvent({ props: model.props, event: editorEvent, eventRef: model.event });
    }

    // if (resolveKeyboardEventEnum(keyCode) === KeyboardEventEnum.OnKeyDown) {

    // } else if (resolveKeyboardEventEnum(keyCode) === KeyboardEventEnum.OnKeyUp) {

    // } else if (resolveKeyboardEventEnum(keyCode) === KeyboardEventEnum.OnKeyPress) {

    // } else {

    // }
    return model;
}

function isTextEditorEvent(isCtrlKey: boolean, key: string): boolean {
    let keys = [Key.A, Key.C, Key.V, Key.X, Key.Enter, Key.Backspace, Key.ShiftLeft, Key.ShiftRight, Key.ArrowUp, Key.ArrowDown];
    let extractKey = Object.keys(Key).find(
        k => Key[k] === key
    );
    if (extractKey !== undefined && keys.indexOf(Key[extractKey]) > -1)
        return true;
    return false;
}

//resolveKeyboardEventEnum(keyCode, model.KeyboardEventEnum)
function resolveKeyboardEventEnum(key: string, modelKeyboardEventEnum: any): KeyboardEventEnum {
    let keydownKeys = [Key.ControlLeft, Key.ControlRight, Key.Enter];
    if (keydownKeys.indexOf(Key[key]) > -1)
        return KeyboardEventEnum.OnKeyDown;
    return KeyboardEventEnum.OnKeyPress;
}

function updateStore_isShiftPressed(modelKeyboardEventEnum: any) {
    if (modelKeyboardEventEnum === KeyboardEventEnum.OnKeyDown) {
        isShiftPressed.set(true);
    }
    if (modelKeyboardEventEnum === KeyboardEventEnum.OnKeyUp) {
        isShiftPressed.set(false);
    }
}

function isUnwantedKeyboardEventEnum(key: string, modelKeyboardEventEnum: any): boolean {
    if (key === Key.Enter && (modelKeyboardEventEnum === KeyboardEventEnum.OnKeyPress || modelKeyboardEventEnum === KeyboardEventEnum.OnKeyUp)) return true;
    if (key === Key.Backspace && (modelKeyboardEventEnum === KeyboardEventEnum.OnKeyPress || modelKeyboardEventEnum === KeyboardEventEnum.OnKeyUp)) return true;
    if (key === Key.ControlLeft || key === Key.ControlRight) return true;
    if ((key === Key.ShiftLeft || key === Key.ShiftRight) && modelKeyboardEventEnum === KeyboardEventEnum.OnKeyPress || modelKeyboardEventEnum === KeyboardEventEnum.OnKeyUp) return true;
    //console.log(`${key} : ${modelKeyboardEventEnum}`);
    return false;
}

function resolveTextEditorEvent(isShiftKey: boolean, isCtrlKey: boolean, isTextEmpty: boolean, key: string): TextEditorEvent {
    let editorEvent: TextEditorEvent;
    switch (key) {
        case Key.A:
            editorEvent = isCtrlKey ? TextEditorEvent.SelectAll : TextEditorEvent.Typing;
            break;

        case Key.C:
            editorEvent = isCtrlKey ? TextEditorEvent.Copy : TextEditorEvent.Typing;
            break;

        case Key.X:
            editorEvent = isCtrlKey ? TextEditorEvent.Cut : TextEditorEvent.Typing;
            break;

        case Key.V:
            editorEvent = isCtrlKey ? TextEditorEvent.Paste : TextEditorEvent.Typing;
            break;

        case Key.Z:
            editorEvent = isCtrlKey ? TextEditorEvent.Undo : TextEditorEvent.Typing;
            break;

        case Key.Enter:
            editorEvent = isShiftKey ? TextEditorEvent.Typing : TextEditorEvent.NewLine;
            break;

        case Key.Backspace:
            if (get(lastTextEditorEvent) === TextEditorEvent.SelectAll) {
                editorEvent = TextEditorEvent.DeleteAll;
            } else {
                editorEvent = isTextEmpty ? TextEditorEvent.Delete : TextEditorEvent.Typing;
            }
            break;

        case Key.ArrowUp:
            editorEvent = isShiftKey ? TextEditorEvent.SelectUp : TextEditorEvent.Typing;
            break;

        case Key.ArrowDown:
            editorEvent = isShiftKey ? TextEditorEvent.SelectDown : TextEditorEvent.Typing;
            break;

        default:
            editorEvent = TextEditorEvent.Typing;
            break;
    }
    lastTextEditorEvent.set(editorEvent);
    return editorEvent;
}

export const setCaretPosition = (el, pos) => {
    const selection = window.getSelection();
    const range = document.createRange();
    if (selection !== null) {
        selection.removeAllRanges();
        range.selectNodeContents(el);
        range.collapse(false);
        selection.addRange(range);
    }
}