import type { Tool, TextEditorEvent, ComponentPosition } from "../utils/enums";


export interface DocumentData {
    component: any;
    componentProps: ComponentProps;
}

export interface ComponentProps {
    id: string;
    index: number;
    type: Tool;
    afterMount: AfterOnMount;
}

export interface AfterOnMount {
    mainNode: any;
    eventDispatcher: any;
    isSelected: boolean;
    insertPositionPreference: ComponentPosition;
}

export interface FocusedComponent {
    id: string;
    type: Tool;
}

export interface ToolBoxEventData {
    selectedTool: Tool;
    selectedToolHtml: string;
}

export interface ComponentEventData {
    id: string;
    type: Tool;
    event: TextEditorEvent;
    eventRef: any;
    props: ComponentProps;
}

