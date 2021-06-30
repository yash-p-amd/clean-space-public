<script lang="ts">
    import { utils } from "../utils/utils";
    import { onMount } from "svelte";
    import { debug } from "svelte/internal";
    import { Tool, ToolBoxEventData } from "../statics/ToolBoxEvent";

    interface checkboxProps {
        componentId: string;
        innerText: string;
    }

    export let props: checkboxProps;

    let componentId;
    let elementId;

    let mainHero;
    let value: string = "Todo";

    elementId = props.componentId;
    componentId = `comp-${elementId}`;

    onMount(() => {
        mainHero.focus();
    });
</script>

<div id={componentId}>
    <input id={elementId} type="checkbox" />
    <div contenteditable="true" bind:this={mainHero}>
        <label for={elementId}>{props.innerText}</label>
    </div>
</div>

<style>
</style>
