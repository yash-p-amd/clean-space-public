import { writable } from 'svelte/store';
import type { FocusedComponent } from "../utils/interfaces";

export const IdCounter = writable<number>(0);
export const focusedComponent = writable<FocusedComponent>(null);