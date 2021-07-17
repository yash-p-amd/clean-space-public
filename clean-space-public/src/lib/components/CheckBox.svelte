<svelte:options immutable={true} />

<script lang="ts">
    import { ComponentEvent, Key, Tool } from "../../utils/enums";
    import { createEventDispatcher, tick } from "svelte";
    import { onMount } from "svelte";
    import type { ComponentProps, AfterOnMount } from "../../utils/interfaces";
    import {
        setFocusOnNode,
        updateFocusNodeInStore,
        setCaretPosition,
        onKeyboardEvent,
    } from "../../utils/shared";
    import { KeyboardEvent } from "../../utils/enums";

    export let props: ComponentProps;

    $: text = "";
    $: isEmpty = text === "" ? true : false;
    $: status = false;

    let afterOnMount: AfterOnMount = {
        mainNode: null,
        eventDispatcher: createEventDispatcher(),
        preventBackspace: false,
    };

    onMount(() => {
        props.afterMount = afterOnMount;
        setFocusOnNode({ props: props });
    });

    const onTextClick = (event) => {};

    const onTextFocus = () => updateFocusNodeInStore({ props: props });

    const attachKeyboardEvent = (event: any, eventType: KeyboardEvent) => {
        onKeyboardEvent({
            props: props,
            event: event,
            keyboardEvent: eventType,
            isEmpty: isEmpty,
        });
    };

    export const setFocus = () => {
        setCaretPosition(props.afterMount.mainNode, text.length);
        setFocusOnNode({ props: props });
    };
</script>

<div class="comp-main" id="comp-{props.id}" contenteditable="false">
    <input id={props.id} type="checkbox" bind:checked={status} />
    {#if !status}
        <div
            contenteditable="true"
            placeholder={props.id}
            bind:textContent={text}
            class="comp-label-div"
            bind:this={afterOnMount.mainNode}
            on:click={onTextClick}
            on:focus={onTextFocus}
            on:keydown={(event) => {
                attachKeyboardEvent(event, KeyboardEvent.OnKeyDown);
            }}
            on:keypress={(event) => {
                attachKeyboardEvent(event, KeyboardEvent.OnKeyPress);
            }}
            on:keyup={(event) => {
                attachKeyboardEvent(event, KeyboardEvent.OnKeyUp);
            }}
        />
    {:else}
        <del>
            <div
                contenteditable="true"
                placeholder={props.id}
                bind:textContent={text}
                class="comp-label-div"
                bind:this={afterOnMount.mainNode}
                on:click={onTextClick}
                on:focus={onTextFocus}
                on:keydown={(event) => {
                    attachKeyboardEvent(event, KeyboardEvent.OnKeyDown);
                }}
                on:keypress={(event) => {
                    attachKeyboardEvent(event, KeyboardEvent.OnKeyPress);
                }}
                on:keyup={(event) => {
                    attachKeyboardEvent(event, KeyboardEvent.OnKeyUp);
                }}
            />
        </del>
    {/if}
</div>

<style>
    .comp-main {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        align-content: center;
    }

    .comp-label-div[placeholder]:empty:before {
        content: attr(placeholder);
        color: #555;
    }

    .comp-label-div[placeholder]:empty:focus:before {
        content: "";
    }
</style>
