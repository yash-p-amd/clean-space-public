import { writable } from 'svelte/store';
import type { CustomNode } from "../utils/interfaces";

export const caretNode = writable<CustomNode>(null);
export const lastUniqueId = writable<number>(0);