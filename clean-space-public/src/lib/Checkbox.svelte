<script lang="ts">
    import { count } from "../utils/store";
    import { Keys } from "../constants/Keys";
    import { onMount, tick, afterUpdate } from "svelte";
    import type { ComponentProps, CustomNode } from "../utils/interfaces";

    export let props: ComponentProps;

    let bindLabel;
    let bindLabelInput;
    let checkboxLabel = "";

    $: inputEditing = true;

    onMount(() => {});

    afterUpdate(() => {
        console.log("Before update");
    });

    export const compOnKeyPress = (event) => {
        if (event.code === Keys.Enter) {
            //debugger;
            event.preventDefault();
        }
    };

    // const onLabelClick = (event) => {
    //     event.preventDefault();
    //     console.log("Label clicked");
    // };

    // const onLabelInputBlur = () => {
    //     console.log("Label input blur");
    //     editing = false;
    // };

    const onCompClick = (event) => {
        console.log("Click");
        event.preventDefault();
    };

    function toggleInput() {
        inputEditing = inputEditing ? false : true;
    }

    $: $count && console.log($count);
</script>

<div class="comp-main" id="comp-{props.componentId}" contenteditable="false">
    <input id={props.componentId} type="checkbox" />

    {#if !inputEditing}
        <label for={props.componentId}>
            <div
                contenteditable="true"
                bind:textContent={checkboxLabel}
                class="comp-label-div"
                bind:this={bindLabel}
                on:click={onCompClick}
            />
        </label>
    {/if}
    {#if inputEditing}
        <input
            bind:this={bindLabelInput}
            bind:value={checkboxLabel}
            on:blur={onCompClick}
            placeholder="To-do"
        />
    {/if}
</div>

<!-- <div class="comp-main" id={componentId} contenteditable="false">
    <input id={elementId} type="checkbox" />
    {#if editing}
        <input
            bind:this={input}
            bind:value={labelValue}
            on:blur={onBlur}
            placeholder="To-do"
        />
    {:else}
        <label for={elementId}>
            <div
                contenteditable="true"
                bind:textContent={labelValue}
                class="comp-label-div"
                bind:this={input}
                on:click={onLabelClick}
            />
        </label>
    {/if}
</div> -->
<style>
    .comp-main {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        align-content: center;
    }

    .comp-label-div {
        min-width: 100%;
    }
</style>
