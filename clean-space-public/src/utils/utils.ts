import { bubble, debug, listen } from "svelte/internal";
import { Tool } from "../statics/ToolBoxEvent";

export function getEventsAction(component) {
    return node => {
        const events = Object.keys(component.$$.callbacks);
        const listeners = [];
        events.forEach(event =>
            listeners.push(listen(node, event, e => bubble(component, e)))
        );
        return {
            destroy: () => {
                listeners.forEach(listener => listener());
            }
        };
    };
}

export function fnGenerateUniqueID(toolType: Tool): string {
    let uID = "";
    let timeStamp = new Date().valueOf();
    if (toolType === Tool.Checkbox) {
        uID = "cpd-checkbox-" + timeStamp;
    }
    if (toolType === Tool.Bullet) {
        uID = "cpd-bullet-" + timeStamp;
    }
    if (toolType === Tool.Header1) {
        uID = "cpd-header1-" + timeStamp;
    }
    if (toolType === Tool.Header2) {
        uID = "cpd-header2-" + timeStamp;
    }
    if (toolType === Tool.Header3) {
        uID = "cpd-header3-" + timeStamp;
    }
    if (toolType === Tool.Header4) {
        uID = "cpd-header4-" + timeStamp;
    }
    if (toolType === Tool.Header5) {
        uID = "cpd-header5-" + timeStamp;
    }
    if (toolType === Tool.Header6) {
        uID = "cpd-header6-" + timeStamp;
    }
    if (toolType === Tool.Div) {
        uID = "cpd-div-" + timeStamp;
    }
    return uID;
}

export function replaceAllRegEx(input: string, regex: RegExp, replace: string): string {
    let matches;
    if ((matches = regex.exec(input)) !== null) {
        matches.forEach((match, groupIndex) => {
            input = input.replaceAll(regex, replace);
        });
    }
    return input;
}

const fnExtractElementId = (node: Node): string => {
    console.log(node);
    return "";
}

const fnGetIndexOfElementInNodesByElementId = (nodes: Node[], elementId: string): number => {

    let index = 0;
    nodes.forEach((node, parentIndex) => {
        node.childNodes.forEach((childNode, index) => {
            if (childNode.id == elementId) {
                index = parentIndex;
            }
        });
    });

    return index;
}

export const rangeManipulation = {
    extractElementId: fnExtractElementId,
    getIndexOfElementInNodesByElementId: fnGetIndexOfElementInNodesByElementId
}

export const utils = {
    generateUniqueID: fnGenerateUniqueID
}

