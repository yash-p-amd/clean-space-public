<svelte:options immutable={true} />

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    import type { ComponentProps, AfterOnMount } from "../../utils/interfaces";
    import {
        setFocusOnNode,
        updateFocusNodeInStore,
        addRemoveComponentAtCaret,
        SetCaretPosition,
    } from "../../utils/shared";

    export let props: ComponentProps;

    $: text = "";
    $: isEmpty = text === "" ? true : false;

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

    const onTextKeydown = (event) =>
        addRemoveComponentAtCaret({
            props: props,
            event: event,
            isEmpty: isEmpty,
        });

    export const setFocus = () => {
        setFocusOnNode({ props: props });
        SetCaretPosition(props.afterMount.mainNode, text.length);
    };
</script>

<div class="comp-main" id="comp-{props.id}" contenteditable="false">
    <div
        contenteditable="true"
        placeholder={props.id}
        bind:textContent={text}
        class="comp-text-div"
        bind:this={afterOnMount.mainNode}
        on:click|stopPropagation={onTextClick}
        on:focus|stopPropagation={onTextFocus}
        on:keydown|stopPropagation={onTextKeydown}
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
</style>
