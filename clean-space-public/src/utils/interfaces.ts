import type { Tool, ComponentEvent } from "../utils/enums";

export interface ComponentProps {
    componentId: string;
    innerText: string;
    index: number;
}

export interface DocumentData {
    component: any;
    componentProps: ComponentProps;
}

export interface FocusedComponent {
    id: string;
    type: Tool;
}

export interface CustomNode extends Node {
    id?: string;
}

export interface Keyboard {
    arrowUp: string;
    arrowDown: string;
    arrowLeft: string;
    arrowRight: string;
    slash: string;
    Enter: string;
    Space: string;
    Backspace: string;
}

export interface ToolBoxEventData {
    selectedTool: Tool;
    selectedToolHtml: string;
}

export interface ComponentEventData {
    id: string;
    type: Tool;
    event: ComponentEvent;
}

