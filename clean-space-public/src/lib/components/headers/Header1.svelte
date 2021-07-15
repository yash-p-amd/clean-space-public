<svelte:options immutable={true} />

<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import type {
        ComponentProps,
        AfterOnMount,
    } from "../../../utils/interfaces";
    import {
        setFocusOnNode,
        updateFocusNodeInStore,
        addRemoveComponentAtCaret,
    } from "../../../utils/shared";

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

    export const setFocus = () => setFocusOnNode({ props: props });
</script>

<div class="comp-main" id="comp-{props.id}" contenteditable="false">
    <h1>
        <div
            contenteditable="true"
            placeholder={props.id}
            bind:textContent={text}
            class="comp-header-div"
            bind:this={afterOnMount.mainNode}
            on:focus={onTextFocus}
            on:keydown={onTextKeydown}
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
    .comp-header-div[placeholder]:empty:before {
        content: attr(placeholder);
        color: #555;
    }
    .comp-header-div[placeholder]:empty:focus:before {
        content: "";
    }
</style>
