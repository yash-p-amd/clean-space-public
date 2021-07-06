import { writable } from 'svelte/store';
import type { CustomNode } from "../utils/interfaces";

export const count = writable<CustomNode>(null);