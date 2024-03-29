import { writable } from 'svelte/store';
import type { FocusedComponent } from "../utils/interfaces";
import type { TextEditorEvent } from './enums';
import { TextEditorEvent as TextEditorEventEnum, Tool } from './enums';


export const IdCounter = writable<number>(0);
export const focusedComponent = writable<FocusedComponent>({
    id: "",
    type: Tool.None,
});
export const lastTextEditorEvent = writable<TextEditorEvent>(TextEditorEventEnum.Typing);
export const isShiftPressed = writable<boolean>(false);
//export const isChassisEvent = writable<boolean>(false);