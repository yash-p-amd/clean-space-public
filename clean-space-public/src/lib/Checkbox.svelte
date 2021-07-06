<script lang="ts">
    import { count } from "../utils/store";
    import { Keys } from "../constants/Keys";
    import { onMount } from "svelte";
    import type { ComponentProps } from "../utils/interfaces";

    export let props: ComponentProps;

    $: text = "";
    $: status = false;
    $: $count && console.log($count);
    let textNode;
    let componentNode;

    onMount(() => {
        textNode.focus();
    });

    const onTextClick = (event) => {};

    const onTextFocus = () => {
        console.log("I am in focus");
        console.log(componentNode);
    };

    export const compOnKeyPress = (event) => {
        if (event.code === Keys.Enter && !event.shiftKey) {
            event.preventDefault();
        }
    };
</script>

<div
    class="comp-main"
    id="comp-{props.componentId}"
    contenteditable="false"
    bind:this={componentNode}
>
    <input id={props.componentId} type="checkbox" bind:checked={status} />
    <div
        contenteditable="true"
        placeholder="To-do"
        bind:textContent={text}
        class="comp-label-div"
        bind:this={textNode}
        on:click|stopPropagation={onTextClick}
        on:focus={onTextFocus}
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

    .comp-label-div[placeholder]:empty:before {
        content: attr(placeholder);
        color: #555;
    }

    .comp-label-div[placeholder]:empty:focus:before {
        content: "";
    }
</style>
