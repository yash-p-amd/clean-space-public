import { writable } from 'svelte/store';

export const componentAtCaret = writable<Node>(null);