<svelte:options immutable={true} />

<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import type {
        ComponentProps,
        AfterOnMount,
    } from "../../../utils/interfaces";
    import {
        onKeyboardEvent,
        setFocusOnNode,
        updateFocusNodeInStore,
    } from "../../../utils/shared";
    import { ComponentPosition, KeyboardEvent } from "../../../utils/enums";

    export let props: ComponentProps;

    $: text = "";
    $: isSelected = false;
    $: isEmpty = text === "" ? true : false;

    let afterOnMount: AfterOnMount = {
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

    const onTextFocus = () => updateFocusNodeInStore({ props: props });

    const attachKeyboardEvent = (event: any, eventType: KeyboardEvent) => {
        onKeyboardEvent({
            props: props,
            event: event,
            keyboardEvent: eventType,
            isEmpty: isEmpty,
        });
    };

    export const setFocus = () => setFocusOnNode({ props: props });

    export const selectComponenet = (value: boolean) => {
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
    <h1>
        <div
            contenteditable="true"
            placeholder={props.id}
            bind:textContent={text}
            class="comp-header-div"
            bind:this={afterOnMount.mainNode}
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
    </h1>
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
    .comp-header-div[placeholder]:empty:before {
        content: attr(placeholder);
        color: #555;
    }
    .comp-header-div[placeholder]:empty:focus:before {
        content: "";
    }

    [contenteditable] {
        outline: 0px solid transparent;
    }
</style>
