import { TextEditorEvent, Key, Tool, KeyboardEvent, ComponentPosition } from "./enums";
import { focusedComponent } from "../utils/store";
import type { ComponentEventData, ComponentProps } from "./interfaces";
import { compute_rest_props, text } from "svelte/internal";
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

    if (model.keyboardEvent === KeyboardEvent.OnKeyDown) {
        if (isTextEditorEvent(isCtrlKey, keyCode)) {
            let editorEvent = resolveTextEditorEvent(isShiftKey, isCtrlKey, isTextEmpty, keyCode);
            if (editorEvent !== TextEditorEvent.Typing) {
                model.props.afterMount.isSelected = true;
                model.event.preventDefault();
                dispatchTextEditorEvent({ props: model.props, event: resolveTextEditorEvent(isShiftKey, isCtrlKey, isTextEmpty, keyCode), eventRef: model.event });
            }
        }
    } else if (model.keyboardEvent === KeyboardEvent.OnKeyUp) {
        //console.log("OnKeyUp");

    } else if (model.keyboardEvent === KeyboardEvent.OnKeyPress) {
        //console.log("OnKeyPress");

    } else {

    }
    return model;
}

function isTextEditorEvent(isCtrlKey: boolean, key: string): boolean {
    let keys = [Key.A, Key.C, Key.V, Key.X, Key.Enter, Key.Backspace];
    if (keys.indexOf(Key[key]) > -1)
        return true;
    return false;
}

function resolveTextEditorEvent(isShiftKey: boolean, isCtrlKey: boolean, isTextEmpty: boolean, key: string): TextEditorEvent {
    switch (key) {
        case Key.A:
            return isCtrlKey ? TextEditorEvent.SelectAll : TextEditorEvent.Typing;
            break;

        case Key.C:
            return isCtrlKey ? TextEditorEvent.Copy : TextEditorEvent.Typing;
            break;

        case Key.X:
            return isCtrlKey ? TextEditorEvent.Cut : TextEditorEvent.Typing;
            break;

        case Key.V:
            return isCtrlKey ? TextEditorEvent.Paste : TextEditorEvent.Typing;
            break;

        case Key.Z:
            return isCtrlKey ? TextEditorEvent.Undo : TextEditorEvent.Typing;

        case Key.Enter:
            return isShiftKey ? TextEditorEvent.Typing : TextEditorEvent.NewLine;

        case Key.Backspace:
            return isTextEmpty ? TextEditorEvent.Delete : TextEditorEvent.Typing;

        default:
            return TextEditorEvent.Typing;
            break;
    }
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