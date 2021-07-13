<svelte:options immutable={true} />

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
    let textNode;

    const dispatch = createEventDispatcher();

    onMount(() => {
        textNode.focus();
    });

    const onTextClick = (event) => {};

    const onTextFocus = () => {
        focusedComponent.set({
            id: props.id,
            type: Tool.Text,
        });
    };

    const dispatchEvent = (eventData: ComponentEventData) => {
        console.log(`Dispatching : ${eventData.event} -> ${eventData.id}`);
        dispatch("message", eventData);
    };

    export const compOnKeyPress = (event) => {
        if (event.code == Keys.Enter && !event.shiftKey) {
            event.preventDefault();
            releaseEvent(ComponentEvent.InsertAfterCaret);
            return;
        }
        if (event.code === Keys.Backspace && text === "") {
            releaseEvent(ComponentEvent.Delete);
            return;
        }
        return;
    };

    export const setFocus = () => {
        textNode.focus();
    };

    function releaseEvent(event: ComponentEvent) {
        dispatchEvent({
            type: Tool.Text,
            event: event,
            id: props.id,
        });
    }
</script>

<div class="comp-main" id="comp-{props.id}" contenteditable="false">
    <div
        contenteditable="true"
        placeholder={props.id}
        bind:textContent={text}
        class="comp-text-div"
        bind:this={textNode}
        on:click|stopPropagation={onTextClick}
        on:focus|stopPropagation={onTextFocus}
        on:keydown|stopPropagation={compOnKeyPress}
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

    .comp-text-div[placeholder]:empty:before {
        content: attr(placeholder);
        color: #555;
    }

    .comp-text-div[placeholder]:empty:focus:before {
        content: "";
    }
</style>
