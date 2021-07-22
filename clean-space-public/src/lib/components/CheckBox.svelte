<svelte:options immutable={true} />

<script lang="ts">
    import {
        TextEditorEvent,
        ComponentPosition,
        Key,
        Tool,
    } from "../../utils/enums";
    import { createEventDispatcher, tick } from "svelte";
    import { onMount, afterUpdate } from "svelte";
    import type { ComponentProps, AfterOnMount } from "../../utils/interfaces";
    import {
        setFocusOnNode,
        updateFocusNodeInStore,
        setCaretPosition,
        onKeyboardEvent,
    } from "../../utils/shared";
    import { KeyboardEvent } from "../../utils/enums";
    import { isShiftPressed } from "../../utils/store";
    import { get } from "svelte/store";

    export let props: ComponentProps;

    $: text = "";
    $: isEmpty = text === "" ? true : false;
    $: isSelected = false;
    $: status = false;

    let afterOnMount: AfterOnMount;
    $: afterOnMount = {
        mainNode: null,
        eventDispatcher: createEventDispatcher(),
        preventBackspace: false,
        isSelected: false,
        insertPositionPreference: ComponentPosition.InsertAfterCaret,
    };

    onMount(() => {
        props.afterMount = afterOnMount;
        setFocusOnNode({ props: props });
    });

    afterUpdate(() => {
        //isSelected = false;
    });

    const onTextClick = (event) => {};

    const onTextFocus = () => {
        //console.log(get(isShiftPressed));
        console.log($isShiftPressed);
        updateFocusNodeInStore({ props: props });
    };

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

    export const setIsSelected = (value: boolean) => {
        if (props.afterMount === undefined) return;
        isSelected = value;
        props.afterMount.isSelected = value;
    };
</script>

<div
    class="comp-main {isSelected ? 'select' : ''}"
    id="comp-{props.id}"
    contenteditable="false"
>
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

    .select {
        background: aliceblue;
    }

    .comp-label-div[placeholder]:empty:before {
        content: attr(placeholder);
        color: #555;
    }

    .comp-label-div[placeholder]:empty:focus:before {
        content: "";
    }

    [contenteditable] {
        outline: 0px solid transparent;
    }
</style>
