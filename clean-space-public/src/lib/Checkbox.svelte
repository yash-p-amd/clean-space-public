<svelte:options accessors={true} />

<script lang="ts">
    import { caretComponentId } from "../utils/store";
    import { createEventDispatcher } from "svelte";
    import { Keys } from "../constants/Keys";
    import { onMount } from "svelte";
    import type {
        ComponentProps,
        ComponentEventData,
    } from "../utils/interfaces";
    import { ComponentEvent } from "../utils/interfaces";

    export let props: ComponentProps;

    $: text = "";
    $: status = false;
    let textNode;
    let componentNode;

    onMount(() => {
        //textNode.focus();
        //console.log(`Mounted : ${props.componentId}`);
    });

    const dispatch = createEventDispatcher();

    const onTextClick = (event) => {};

    const onTextFocus = () => {
        //caretNode.set(componentNode);
        //caretIndex.set(props.index);
        caretComponentId.set(props.componentId);
    };

    const dispatchEvent = (eventData: ComponentEventData) => {
        console.log(
            `Dispatching : ${eventData.componentEvent} -> ${eventData.componentId}`
        );
        dispatch("message", eventData);
    };

    export const compOnKeyPress = (event) => {
        if (event.code === Keys.Backspace && text === "") {
            dispatchEvent({
                componentEvent: ComponentEvent.Delete,
                componentId: props.componentId,
            });
        }
        //debugger;
        // if (event.code == Keys.Enter) {
        //     if (!event.shiftKey) {
        //         event.preventDefault();
        //         // dispatchEvent({
        //         //     sourceNode: componentNode as ComponentInstance,
        //         //     sourceNodeType: Tool.Checkbox,
        //         //     sourceProps: props,
        //         // });
        //     } else {
        //         return;
        //     }
        // }
    };

    export const compGetNode = () => {
        //debugger;
        return componentNode;
    };

    export const setFocus = () => {
        textNode.focus();
    };
</script>

<div
    class="comp-main"
    id="comp-{props.componentId}"
    contenteditable="false"
    bind:this={componentNode}
>
    <input id={props.componentId} type="checkbox" bind:checked={status} />
    {#if !status}
        <div
            contenteditable="true"
            placeholder={props.componentId}
            bind:textContent={text}
            class="comp-label-div"
            bind:this={textNode}
            on:click|stopPropagation={onTextClick}
            on:focus={onTextFocus}
            on:keydown={compOnKeyPress}
        />
    {:else}
        <del>
            <div
                contenteditable="true"
                placeholder={props.componentId}
                bind:textContent={text}
                class="comp-label-div"
                bind:this={textNode}
                on:click|stopPropagation={onTextClick}
                on:focus={onTextFocus}
                on:keydown={compOnKeyPress}
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
