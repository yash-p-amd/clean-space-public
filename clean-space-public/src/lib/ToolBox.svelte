<script lang="ts">
    //imports
    import { ToolBoxEvent } from "../statics/ToolBoxEvent";
    import { Tool } from "../statics/ToolBoxEvent";
    import { Key } from "../constants/Key";
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    import { beforeUpdate } from "svelte";

    //svelte constants
    const dispatch = createEventDispatcher();

    //variables
    let value;
    let mainHero;
    $: tools = [];

    //custom functionality
    beforeUpdate(() => {
        tools = Object.keys(Tool).filter((key) => isNaN(Number(key)));
    });

    onMount(() => {
        mainHero.focus();
    });

    const onKeyDown = (e) => {
        if (e.code === Key.Enter) {
            dispatchEvent();
        }
    };

    const dispatchEvent = () => {
        var event = new ToolBoxEvent();
        event.selectedTool = value;
        dispatch("message", event);
    };
</script>

<select
    bind:this={mainHero}
    bind:value
    on:keydown={onKeyDown}
    on:click={dispatchEvent}
    size={tools.length}
>
    {#each tools as tool}
        <option value={tool}>{tool}</option>
    {/each}
</select>
<button on:click={dispatchEvent}> Click to say hello </button>
{value}

<style>
</style>
