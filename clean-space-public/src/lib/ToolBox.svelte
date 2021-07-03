<script lang="ts">
    //imports
    import { ToolBoxEventData } from "../statics/ToolBoxEvent";
    import { Tool } from "../statics/ToolBoxEvent";
    import { Keys } from "../constants/Keys";
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    import { beforeUpdate } from "svelte";

    //svelte constants
    const dispatch = createEventDispatcher();

    //variables
    let value: Tool = Tool.None;
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
        if (e.code === Keys.Enter) {
            let eventData = new ToolBoxEventData();
            eventData.selectedTool = value;
            eventData.selectedToolHtml = getHtmlForTool(value);
            dispatchEvent(eventData);
            return;
        }
        if (e.code === Keys.slash && !e.ctrlKey) {
            let eventData = new ToolBoxEventData();
            eventData.selectedTool = Tool.None;
            eventData.selectedToolHtml = getHtmlForTool(value);
            dispatchEvent(eventData);
            return;
        }
    };

    const dispatchEvent = (eventData: ToolBoxEventData) => {
        dispatch("message", eventData);
    };

    function getHtmlForTool(tool: Tool): string {
        if (tool === Tool.Bullet) {
            return "<ul id=${uID}><li>Bullet</li></ul>";
        }
        if (tool === Tool.Checkbox) {
            return '<div><input id=${uID} type="checkbox"><label for=${uID}></label></div>';
        }
        if (tool === Tool.Header1) {
            return '<h1 id=${uID} style="color: red">Header1</h1>';
        }
        if (tool === Tool.Header2) {
            return '<h2 id=${uID} style="color: red">Header2</h2>';
        }
        if (tool === Tool.Header3) {
            return '<h3 id=${uID} style="color: red">Header3</h3>';
        }
        if (tool === Tool.Header4) {
            return '<h4 id=${uID} style="color: red">Header4</h4>';
        }
        if (tool === Tool.Header5) {
            return '<h5 id=${uID} style="color: red">Header5</h5>';
        }
        if (tool === Tool.Header6) {
            return '<h6 id=${uID} style="color: red">Header6</h6>';
        }
        if (tool === Tool.Card) {
            let stringBuilder = [];
            stringBuilder.push('<article class="forecast">');
            stringBuilder.push("<h1>Heading</h1>");
            stringBuilder.push('<article class="day-forecast">');
            stringBuilder.push("<h2>Title</h2>");
            stringBuilder.push("<p>Content...</p>");
            stringBuilder.push("</article>");
            stringBuilder.push("</article>");
            return stringBuilder.join("");
        }
        return "";
    }
</script>

<select
    bind:this={mainHero}
    bind:value
    on:keypress|stopPropagation={onKeyPress}
    on:click|stopPropagation={() => {
        dispatchEvent;
    }}
    size={tools.length}
>
    {#each tools as tool}
        <option value={tool}>{tool}</option>
    {/each}
</select>
<button
    on:click={() => {
        dispatchEvent;
    }}
>
    Click to say hello
</button>
{value}

<style>
</style>
