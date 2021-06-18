<script lang="ts">
    //imports
    import { ToolBoxEventData } from "../statics/ToolBoxEvent";
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

    const onKeyPress = (e) => {
        if (e.code === Key.Enter) {
            let eventData = new ToolBoxEventData();
            eventData.selectedTool = value;
            dispatchEvent(eventData);
            return;
        }
        if (e.code === Key.slash && !e.ctrlKey) {
            let eventData = new ToolBoxEventData();
            eventData.selectedTool = Tool.None;
            dispatchEvent(eventData);
            return;
        }
    };

    const dispatchEvent = (eventData: ToolBoxEventData) => {
        dispatch("message", eventData);
    };
</script>

<select
    bind:this={mainHero}
    bind:value
    on:keypress|stopPropagation={onKeyPress}
    on:click|stopPropagation={dispatchEvent}
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
