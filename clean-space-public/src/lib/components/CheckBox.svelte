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
        onKeyboardEventEnum,
    } from "../../utils/shared";
    import { KeyboardEventEnum } from "../../utils/enums";
    import { isShiftPressed } from "../../utils/store";

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
        //console.log($isShiftPressed);
        updateFocusNodeInStore({ props: props });

        setIsSelected($isShiftPressed);
    };

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
                attachKeyboardEventEnum(event, KeyboardEventEnum.OnKeyDown);
            }}
            on:keypress={(event) => {
                attachKeyboardEventEnum(event, KeyboardEventEnum.OnKeyPress);
            }}
            on:keyup={(event) => {
                attachKeyboardEventEnum(event, KeyboardEventEnum.OnKeyUp);
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
                    attachKeyboardEventEnum(event, KeyboardEventEnum.OnKeyDown);
                }}
                on:keypress={(event) => {
                    attachKeyboardEventEnum(
                        event,
                        KeyboardEventEnum.OnKeyPress
                    );
                }}
                on:keyup={(event) => {
                    attachKeyboardEventEnum(event, KeyboardEventEnum.OnKeyUp);
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
