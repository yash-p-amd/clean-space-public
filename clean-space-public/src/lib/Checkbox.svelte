<script lang="ts">
    import { count } from "../utils/store";
    import { createEventDispatcher } from "svelte";
    import { Keys } from "../constants/Keys";
    import { onMount } from "svelte";
    import type {
        ComponentProps,
        CheckboxEventData,
        ComponentInstance,
    } from "../utils/interfaces";
    import { Tool } from "../utils/interfaces";

    export let props: ComponentProps;

    $: text = "";
    $: status = false;
    //$: $count && console.log($count);
    let textNode;
    let componentNode;

    onMount(() => {
        //textNode.focus();
    });

    const dispatch = createEventDispatcher();

    const onTextClick = (event) => {};

    const onTextFocus = () => {
        //console.log("I am in focus");
        //console.log(componentNode);
    };

    const onComponentNodeFocus = () => {
        console.log("ComponentNode focus");
    };

    const dispatchEvent = (eventData: CheckboxEventData) => {
        console.log("Dispatching " + eventData.sourceProps.componentId);
        dispatch("message", eventData);
    };

    export const compOnKeyPress = (event) => {
        if (event.code == Keys.Enter) {
            if (!event.shiftKey) {
                event.preventDefault();
                dispatchEvent({
                    sourceNode: componentNode as ComponentInstance,
                    sourceNodeType: Tool.Checkbox,
                    sourceProps: props,
                });
            } else {
                return;
            }
        }
    };

    export const compGetNode = () => {
        return componentNode;
    };
</script>

<div
    class="comp-main"
    id="comp-{props.componentId}"
    contenteditable="false"
    bind:this={componentNode}
    on:focus={onComponentNodeFocus}
>
    <input id={props.componentId} type="checkbox" bind:checked={status} />
    {#if !status}
        <div
            contenteditable="true"
            placeholder="To-do"
            bind:textContent={text}
            class="comp-label-div"
            bind:this={textNode}
            on:click|stopPropagation={onTextClick}
            on:focus={onTextFocus}
        />
    {:else}
        <del>
            <div
                contenteditable="true"
                placeholder="To-do"
                bind:textContent={text}
                class="comp-label-div"
                bind:this={textNode}
                on:click|stopPropagation={onTextClick}
                on:focus={onTextFocus}
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
