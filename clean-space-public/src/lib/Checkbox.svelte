<script lang="ts">
    import { Keys } from "../constants/Keys";
    import { onMount, tick } from "svelte";
    import type { ComponentProps } from "../utils/interfaces";

    export let props: ComponentProps;

    let componentId;
    let elementId;

    $: labelValue = "Todo";

    elementId = props.componentId;
    componentId = `comp-${elementId}`;

    onMount(() => {});

    const onLabelClick = (event) => {
        event.preventDefault();
    };

    const onLabelKeyPress = (event) => {
        if (event.code === Keys.Enter) {
            event.preventDefault();
            console.log(labelValue);
        }
    };

    export const exportedOnKeyPress = (event) => {
        if (event.code === Keys.Enter) {
            event.preventDefault();
        }
    };
</script>

<div class="comp-main" id={componentId}>
    <input id={elementId} type="checkbox" />
    <label for={elementId}>
        <div
            contenteditable="true"
            bind:textContent={labelValue}
            on:click|stopPropagation={onLabelClick}
            on:keypress|stopPropagation={onLabelKeyPress}
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
