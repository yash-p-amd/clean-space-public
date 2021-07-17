<svelte:options immutable={true} />

<script lang="ts">
    import { createEventDispatcher } from "svelte";
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
    $: isSelected = false;
    $: isEmpty = text === "" ? true : false;

    let afterOnMount: AfterOnMount = {
        mainNode: null,
        eventDispatcher: createEventDispatcher(),
        preventBackspace: false,
        isSelected: false,
    };

    onMount(() => {
        props.afterMount = afterOnMount;
        setFocusOnNode({ props: props });
    });

    const attachKeyboardEvent = (event: any, eventType: KeyboardEvent) => {
        onKeyboardEvent({
            props: props,
            event: event,
            keyboardEvent: eventType,
            isEmpty: isEmpty,
        });
    };

    const onTextClick = (event) => {};

    const onTextFocus = () => updateFocusNodeInStore({ props: props });

    export const setFocus = () => {
        setFocusOnNode({ props: props });
        setCaretPosition(props.afterMount.mainNode, text.length);
    };

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
    <div
        contenteditable="true"
        placeholder={props.id}
        bind:textContent={text}
        class="comp-text-div"
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
    .comp-text-div {
        min-width: 50px;
    }
    .comp-text-div[placeholder]:empty:before {
        content: attr(placeholder);
        color: #555;
    }
    .comp-text-div[placeholder]:empty:focus:before {
        content: "";
    }

    [contenteditable] {
        outline: 0px solid transparent;
    }
</style>
