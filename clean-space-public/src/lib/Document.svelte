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
    $: contentText = "";
    $: isToolBoxVisible = false;

    //custom functionality
    onMount(() => {
        mainHero.focus();
    });

    const onKeyPress = (e) => {
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
        if (eventData.selectedTool === Tool.Bullet) {
            contentText = contentText + "<ul><li>Coffee</li></ul>";
        }
        if (eventData.selectedTool === Tool.Header1) {
            contentText =
                contentText + '<h1 style="color: red"><span>He</span></h1>';
        }
        if (eventData.selectedTool === Tool.Header2) {
            contentText = contentText + '<h2 style="color: red">Header2</h2>';
        }
        if (eventData.selectedTool === Tool.Header3) {
            contentText = contentText + '<h3 style="color: red">Header3</h3>';
        }
        mainHero.focus();
        hideToolBox();
        setTimeout(setCaret, 10);
    }

    function setCaret() {
        console.log("setCaret");
        var range = document.createRange();
        var sel = window.getSelection();

        console.log(mainHero);
        console.log(mainHero.childNodes[mainHero.childNodes.length - 1]);
        range.setStartAfter(
            mainHero.childNodes[mainHero.childNodes.length - 1]
        );
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    }
</script>

<div
    bind:this={mainHero}
    bind:innerHTML={contentText}
    on:keypress={onKeyPress}
    contenteditable="true"
    class="cpd-main"
/>
{contentText}
<pre />
{#if isToolBoxVisible}
    <ToolBox
        bind:this={toolBox}
        on:message={onToolBoxEvent}
        on:focus={onToolFocus}
    />
{/if}

<style>
    .cpd-main {
        border: solid;
        background-color: #eee;
        max-width: 14rem;
        margin: 1rem auto;
        line-height: 1.35;
    }
</style>
