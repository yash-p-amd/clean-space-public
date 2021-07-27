<svelte:options immutable={true} />

<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import type {
        ComponentProps,
        AfterOnMount,
    } from "../../../utils/interfaces";
    import {
        onKeyboardEventEnum,
        setFocusOnNode,
        updateFocusNodeInStore,
    } from "../../../utils/shared";
    import { ComponentPosition, KeyboardEventEnum } from "../../../utils/enums";

    export let props: ComponentProps;

    $: text = "";
    $: isSelected = false;
    $: isEmpty = text === "" ? true : false;

    let afterOnMount: AfterOnMount = {
        mainNode: null,
        eventDispatcher: createEventDispatcher(),
        isSelected: false,
        insertPositionPreference: ComponentPosition.InsertAfterCaret,
    };

    onMount(() => {
        props.afterMount = afterOnMount;
        setFocusOnNode({ props: props });
    });

    const onTextFocus = () => updateFocusNodeInStore({ props: props });

    const attachKeyboardEventEnum = (
        event: any,
        eventType: KeyboardEventEnum
    ) => {
        onKeyboardEventEnum({
            props: props,
            event: event,
            KeyboardEventEnum: eventType,
            isEmpty: isEmpty,
        });
    };

    export const setFocus = () => setFocusOnNode({ props: props });

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
    <h1>
        <div
            contenteditable="true"
            placeholder={props.id}
            bind:textContent={text}
            class="comp-header-div"
            bind:this={afterOnMount.mainNode}
            on:focus={onTextFocus}
            on:keydown={(event) => {
                attachKeyboardEventEnum(event, KeyboardEventEnum.OnKeyDown);
            }}
            on:keypress={(event) => {
                attachKeyboardEventEnum(event, KeyboardEventEnum.OnKeyPress);
            }}
            on:keyup={(event) => {
                attachKeyboardEventEnum(event, KeyboardEventEnum.OnKeyUp);
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
