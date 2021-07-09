import type { SvelteComponent } from 'svelte';

export interface ComponentProps {
    componentId: string;
    innerText: string;
    index: number;
}

export interface DocumentData {
    component: any;
    componentProps: ComponentProps;
}

// export interface ComponentInstance extends SvelteComponent {
//     compOnKeyPress: Function;
//     compGetNode: Function;
// }

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
    componentId: string;
    componentEvent: ComponentEvent;
}

export enum ComponentEvent {
    Delete = "Delete"
}

export enum Tool {
    None = "None",
    Header1 = "Header1",
    Header2 = "Header2",
    Header3 = "Header3",
    Header4 = "Header4",
    Header5 = "Header5",
    Header6 = "Header6",
    Bullet = "Bullet",
    Checkbox = "Checkbox",
    Card = "Card",
}