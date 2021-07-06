import type { SvelteComponent } from 'svelte';

export interface ComponentProps {
    componentId: string;
    innerText: string;
}

export interface DocumentData {
    tag: string;
    component: any;
    componentProps: ComponentProps;
    componentInstance?: ComponentInstance;
    componentEvent: any;
}

export interface ComponentInstance extends SvelteComponent {
    compOnKeyPress: Function;
    compGetNode: Function;
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
    Space: string,
    Backspace: string
}

export interface CheckboxEventData {
    sourceNode: ComponentInstance;
    sourceNodeType: Tool;
    sourceProps: ComponentProps;
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