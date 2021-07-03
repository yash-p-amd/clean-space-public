import type { SvelteComponent } from 'svelte';

export interface ComponentProps {
    componentId: string;
    innerText: string;
}

export interface DocumentData {
    tag: string;
    component: object;
    componentProps: ComponentProps;
    componentInstance?: ComponentInstance;
}

interface ComponentInstance extends SvelteComponent {
    exportedOnKeyPress: Function;
}

export interface Node {
    id: string;
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