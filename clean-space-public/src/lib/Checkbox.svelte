<script lang="ts">
    import { onMount } from "svelte";
    import { debug } from "svelte/internal";

    export let componentId;

    let elementId;
    let mainHero;
    let value: string = "Todo";

    onMount(() => {
        debugger;
        elementId = componentId;
        componentId = `comp-${elementId}`;
        mainHero.focus();
    });
</script>

<div id={componentId}>
    <input id={elementId} type="checkbox" />
    <div contenteditable="true" bind:this={mainHero}>
        <label for={elementId}>{value}</label>
    </div>
</div>

<style>
</style>
