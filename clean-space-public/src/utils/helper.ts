import { Tool } from "./enums";
import { IdCounter } from "../utils/store";
import { get } from 'svelte/store';

export function fnGenerateNewId(toolType: Tool): string {
    let counter = get(IdCounter) + 1;
    let id: string = "";
    if (toolType === Tool.Checkbox) {
        id = "cpd-checkbox-" + counter;
    }
    if (toolType === Tool.Bullet) {
        id = "cpd-bullet-" + counter;
    }
    if (toolType === Tool.Header1) {
        id = "cpd-header1-" + counter;
    }
    if (toolType === Tool.Header2) {
        id = "cpd-header2-" + counter;
    }
    if (toolType === Tool.Header3) {
        id = "cpd-header3-" + counter;
    }
    if (toolType === Tool.Header4) {
        id = "cpd-header4-" + counter;
    }
    if (toolType === Tool.Header5) {
        id = "cpd-header5-" + counter;
    }
    if (toolType === Tool.Header6) {
        id = "cpd-header6-" + counter;
    }
    if (toolType === Tool.Text) {
        id = "cpd-text-" + counter;
    }
    IdCounter.set(counter);
    return id;
}

export const util = {
    generateNewId: fnGenerateNewId
}



