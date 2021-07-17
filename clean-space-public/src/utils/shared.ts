import { ComponentEvent, Key, Tool, KeyboardEvent } from "./enums";
import { focusedComponent } from "../utils/store";
import type { ComponentEventData, ComponentProps } from "./interfaces";


function foo(model: { property1: number; property2: number }) {
    model.property1++;
    model.property2++;

    // Not needed but
    // considered good practice.
    return model;
}

export const setFocusOnNode = (model: { props: ComponentProps }) => {
    model.props.afterMount.mainNode.focus();
}

export const updateFocusNodeInStore = (model: { props: ComponentProps }) => {
    focusedComponent.set({
        id: model.props.id,
        type: model.props.type,
    });
}

export const triggerEvent = (model: { props: ComponentProps, event: ComponentEvent, eventRef: any }) => {

    let eData: ComponentEventData = {
        event: model.event,
        id: model.props.id,
        type: model.props.type,
        eventRef: model.eventRef,
    }

    console.log(`Dispatching : ${eData.event} -> ${eData.id}`);
    model.props.afterMount.eventDispatcher("message", eData);
};

export const onKeyboardEvent = (model: { props: ComponentProps, event: any, keyboardEvent: KeyboardEvent, isEmpty: boolean }) => {
    if (model.keyboardEvent === KeyboardEvent.OnKeyDown) {

        // Enter
        if (model.event.code === Key.Enter && !model.event.shiftKey) {
            model.event.preventDefault();
            triggerEvent({
                props: model.props,
                event: ComponentEvent.InsertAfterCaret,
                eventRef: model.event
            });
            return;
        }

        //Backspace
        if (model.event.code === Key.Backspace && model.isEmpty) {
            model.event.preventDefault();
            triggerEvent({ props: model.props, event: ComponentEvent.Delete, eventRef: model.event });
            return;
        }

        //Ctrl + A
        if (model.event.code === Key.A && model.event.ctrlKey) {
            //console.log("Select All");
            triggerEvent({ props: model.props, event: ComponentEvent.SelectAll, eventRef: model.event });
        }

        return;
    } else if (model.keyboardEvent === KeyboardEvent.OnKeyUp) {
        //console.log("OnKeyUp");
        return;
    } else if (model.keyboardEvent === KeyboardEvent.OnKeyPress) {
        //console.log("OnKeyPress");
        return;
    } else {
        return;
    }


}

export const setCaretPosition = (el, pos) => {
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.addRange(range);
    //el.focus();
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