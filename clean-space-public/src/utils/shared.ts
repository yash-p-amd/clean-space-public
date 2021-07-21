import { TextEditorEvent, Key, Tool, KeyboardEvent, ComponentPosition } from "./enums";
import { focusedComponent, lastTextEditorEvent } from "../utils/store";
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

    console.log(`Dispatching : ${eData.event} -> ${eData.id}`);
    model.props.afterMount.eventDispatcher("message", eData);
    return model;
};

export const onKeyboardEvent = (model: { props: ComponentProps, event: any, keyboardEvent: KeyboardEvent, isEmpty: boolean }) => {
    let keyCode = model.event.code;
    let isCtrlKey = model.event.ctrlKey;
    let isShiftKey = model.event.shiftKey;
    let isTextEmpty = model.isEmpty;

    console.log(model.keyboardEvent);
    if (killUnwantedKeyboardEvent(keyCode, model.keyboardEvent)) return;

    if (isTextEditorEvent(isCtrlKey, keyCode)) {
        let editorEvent = resolveTextEditorEvent(isShiftKey, isCtrlKey, isTextEmpty, keyCode);
        if (editorEvent === TextEditorEvent.Typing) return;
        model.props.afterMount.isSelected = true;
        model.event.preventDefault();
        dispatchTextEditorEvent({ props: model.props, event: editorEvent, eventRef: model.event });
    }

    // if (resolveKeyboardEvent(keyCode) === KeyboardEvent.OnKeyDown) {

    // } else if (resolveKeyboardEvent(keyCode) === KeyboardEvent.OnKeyUp) {

    // } else if (resolveKeyboardEvent(keyCode) === KeyboardEvent.OnKeyPress) {

    // } else {

    // }
    return model;
}

function isTextEditorEvent(isCtrlKey: boolean, key: string): boolean {
    let keys = [Key.A, Key.C, Key.V, Key.X, Key.Enter, Key.Backspace];
    let extractKey = Object.keys(Key).find(
        k => Key[k] === key
    );
    if (extractKey !== undefined && keys.indexOf(Key[extractKey]) > -1)
        return true;
    return false;
}

//resolveKeyboardEvent(keyCode, model.keyboardEvent)
function resolveKeyboardEvent(key: string, modelKeyboardEvent: any): KeyboardEvent {
    let keydownKeys = [Key.ControlLeft, Key.ControlRight, Key.Enter];
    if (keydownKeys.indexOf(Key[key]) > -1)
        return KeyboardEvent.OnKeyDown;
    return KeyboardEvent.OnKeyPress;
}

function killUnwantedKeyboardEvent(key: string, modelKeyboardEvent: any): boolean {
    if (key === Key.Enter && (modelKeyboardEvent === KeyboardEvent.OnKeyPress || modelKeyboardEvent === KeyboardEvent.OnKeyUp)) return true;
    if (key === Key.Backspace && (modelKeyboardEvent === KeyboardEvent.OnKeyPress || modelKeyboardEvent === KeyboardEvent.OnKeyUp)) return true;
    if (key === Key.ControlLeft || key === Key.ControlRight) return true;
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
            let temp: TextEditorEvent;
            if (get(lastTextEditorEvent) === TextEditorEvent.SelectAll) {
                temp = TextEditorEvent.DeleteAll;
            } else {
                temp = isTextEmpty ? TextEditorEvent.Delete : TextEditorEvent.Typing;
            }
            editorEvent = temp;
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

// export const SetCaretPosition = (el, pos) => {

//     // Loop through all child nodes
//     for (var node of el.childNodes) {
//         if (node.nodeType == 3) { // we have a text node
//             if (node.length >= pos) {
//                 // finally add our range
//                 var range = document.createRange(),
//                     sel = window.getSelection();
//                 range.setStart(node, pos);
//                 range.setEnd(node, pos);
//                 range.collapse(true);
//                 sel.removeAllRanges();
//                 sel.addRange(range);
//                 return -1; // we are done
//             } else {
//                 pos -= node.length;
//             }
//         } else {
//             pos = SetCaretPosition(node, pos);
//             if (pos == -1) {
//                 return -1; // no need to finish the for loop
//             }
//         }
//     }
//     return pos; // needed because of recursion stuff
// }