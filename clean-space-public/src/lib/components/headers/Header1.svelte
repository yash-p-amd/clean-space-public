<svelte:options immutable={true} />

<script lang="ts">
    import { focusedComponent } from "../../../utils/store";
    import { createEventDispatcher, onMount } from "svelte";
    import type {
        ComponentProps,
        ComponentEventData,
    } from "../../../utils/interfaces";
    import { Keys } from "../../../constants/Keys";
    import { ComponentEvent, Tool } from "../../../utils/enums";

    export let props: ComponentProps;

    $: text = "";
    let textNode;

    const dispatch = createEventDispatcher();

    onMount(() => {
        textNode.focus();
    });

    const onTextFocus = () => {
        focusedComponent.set({
            id: props.id,
            type: Tool.Header1,
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
    <h1>
        <div
            contenteditable="true"
            placeholder={props.id}
            bind:textContent={text}
            class="comp-header-div"
            bind:this={textNode}
            on:focus={onTextFocus}
            on:keydown={compOnKeyPress}
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
