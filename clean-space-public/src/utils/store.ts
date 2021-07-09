import { writable } from 'svelte/store';
import type { CustomNode } from "../utils/interfaces";

export const lastUniqueId = writable<number>(0);
export const caretComponentId = writable<string>(null);