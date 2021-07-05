<script lang="ts">
    import { Keys } from "../constants/Keys";
    import { onMount, tick } from "svelte";
    import type { ComponentProps } from "../utils/interfaces";
    import { componentAtCaret } from "../utils/store";

    export let props: ComponentProps;

    let componentId;
    let elementId;

    $: labelValue = "Todo";

    elementId = props.componentId;
    componentId = `comp-${elementId}`;

    onMount(() => {});

    export const onKeyPress = (event) => {
        if (event.code === Keys.Enter) {
            event.preventDefault();
            debugger;
            componentAtCaret.set(this);
        }
    };

    const onFocus = () => {
        debugger;
        componentAtCaret.set(this);
    };
</script>

<div on:focus={onFocus} class="comp-main" id={componentId}>
    <input id={elementId} type="checkbox" />
    <label for={elementId}>
        <div
            contenteditable="true"
            bind:textContent={labelValue}
            class="comp-label-div"
        />
    </label>
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

    .comp-label-div {
        min-width: 5px;
    }
</style>
