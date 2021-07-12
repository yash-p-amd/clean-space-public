<svelte:options accessors={true} />

<script lang="ts">
    import { focusedComponent } from "../../utils/store";
    import { createEventDispatcher } from "svelte";
    import { Keys } from "../../constants/Keys";
    import { onMount } from "svelte";
    import type {
        ComponentProps,
        ComponentEventData,
    } from "../../utils/interfaces";
    import { ComponentEvent, Tool } from "../../utils/enums";

    export let props: ComponentProps;

    $: text = "";
    $: status = false;
    let textNode;

    const dispatch = createEventDispatcher();

    onMount(() => {
        textNode.focus();
    });

    const onTextClick = (event) => {};

    const onTextFocus = () => {
        focusedComponent.set({
            id: props.id,
            type: Tool.Checkbox,
        });
    };

    const dispatchEvent = (eventData: ComponentEventData) => {
        console.log(`Dispatching : ${eventData.event} -> ${eventData.id}`);
        dispatch("message", eventData);
    };

    export const compOnKeyPress = (event) => {
        if (event.code === Keys.Backspace && text === "") {
            dispatchEvent({
                type: Tool.Checkbox,
                event: ComponentEvent.Delete,
                id: props.id,
            });
        }
    };

    export const setFocus = () => {
        textNode.focus();
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
            bind:this={textNode}
            on:click|stopPropagation={onTextClick}
            on:focus={onTextFocus}
            on:keydown={compOnKeyPress}
        />
    {:else}
        <del>
            <div
                contenteditable="true"
                placeholder={props.id}
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
