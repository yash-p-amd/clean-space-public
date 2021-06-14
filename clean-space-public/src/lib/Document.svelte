<script lang="ts">
    //imports
    import ToolBox from "./ToolBox.svelte";
    import { Tool, ToolBoxEvent } from "../statics/ToolBoxEvent";
    import { Key } from "../constants/Key";
    import { onMount } from "svelte";

    //svelte constants
    //variables
    let mainHero;
    let toolBox;
    $: isToolBoxVisible = false;
    $: contentText = "";

    //custom functionality
    onMount(async () => {
        mainHero.focus();
    });

    const onKeyDown = (e) => {
        if (!e.ctrlKey && e.code === Key.slash) {
            displayToolBox();
        } else {
            hideToolBox();
        }
    };

    const onToolFocus = () => {};

    const displayToolBox = () => {
        isToolBoxVisible = true;
    };

    const hideToolBox = () => {
        isToolBoxVisible = false;
    };

    function onToolBoxEvent(event) {
        var eventData = event.detail as ToolBoxEvent;
        console.log(eventData);
        if (eventData.selectedTool === Tool.Bullet) {
            console.log("Typescript is working fine");
        }
        mainHero.focus();
        hideToolBox();
    }
</script>

<div
    bind:this={mainHero}
    on:keydown={onKeyDown}
    contenteditable="true"
    class="cpd-main"
>
    {contentText}
</div>
{#if isToolBoxVisible}
    <ToolBox
        bind:this={toolBox}
        on:message={onToolBoxEvent}
        on:focus={onToolFocus}
    />
{/if}
{contentText}

<style>
    .cpd-main {
        border: solid;
        background-color: #eee;
        max-width: 14rem;
        margin: 1rem auto;
        line-height: 1.35;
    }
</style>
