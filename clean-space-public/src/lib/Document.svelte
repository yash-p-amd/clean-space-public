<script lang="ts">
    //imports
    import ToolBox from "./ToolBox.svelte";
    import { tick } from "svelte";
    import { Tool, ToolBoxEventData } from "../statics/ToolBoxEvent";
    import { Key } from "../constants/Key";
    import { onMount } from "svelte";
    import { generateUniqueID } from "../utils/utils";

    //svelte constants
    //variables
    let mainHero;
    let toolBox;
    let trackLastElement: Tool = Tool.None;
    $: contentText = "";
    $: isToolBoxVisible = false;

    //custom functionality
    onMount(() => {
        mainHero.focus();
    });

    const onKeyPress = async (e) => {
        //Only "/"
        if (e.code === Key.slash && !e.shiftKey) {
            toggleToolBox();
            return;
        }

        //Only "Enter" after checkbox
        if (
            e.code === Key.Enter &&
            !e.shiftKey &&
            trackLastElement === Tool.Checkbox
        ) {
            e.preventDefault();
            insertCheckbox();
            return;
        }

        //"Shift" + "Enter"
        if (e.shiftKey && e.code === Key.Enter) {
            trackLastElement = Tool.None;
            return;
        }
        hideToolBox();
    };

    const onToolFocus = () => {};

    const displayToolBox = () => {
        isToolBoxVisible = true;
    };

    const hideToolBox = async () => {
        isToolBoxVisible = false;
    };

    const toggleToolBox = () => {
        isToolBoxVisible = isToolBoxVisible ? false : true;
    };

    const onToolBoxEventData = async (event) => {
        let eventData = event.detail as ToolBoxEventData;
        globalInsertElement(eventData.selectedTool, eventData.selectedToolHtml);
        mainHero.focus();
        hideToolBox();
    };

    const insertCheckbox = async () => {
        globalInsertElement(
            Tool.Checkbox,
            '<div><input id=${uID} type="checkbox"><label for=${uID}></label></div>'
        );
    };

    const globalInsertElement = async (tool: Tool, innerHtml: string) => {
        setCaret();
        let uID = generateUniqueID(tool);
        innerHtml = innerHtml.replace("${uID}", uID);
        contentText = contentText + innerHtml;
        trackLastElement = tool;
        setCaret();
    };

    const insertNewLine = async () => {
        setCaret();
        contentText = contentText + `<br>`;
        setCaret();
    };

    const setCaret = async () => {
        await tick();
        let range = document.createRange();
        let sel = window.getSelection();

        range.setStartAfter(
            mainHero.childNodes[mainHero.childNodes.length - 1]
        );
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    };
</script>

<div
    bind:this={mainHero}
    bind:innerHTML={contentText}
    on:keypress|stopPropagation={onKeyPress}
    contenteditable="true"
    class="cpd-main"
/>

{contentText}

<pre />

{#if isToolBoxVisible}
    <ToolBox
        bind:this={toolBox}
        on:message={onToolBoxEventData}
        on:focus={onToolFocus}
    />
{/if}

<style>
    .cpd-main {
        text-align: left;
        white-space: pre-line;
        border: solid;
        /* background-color: #eee; */
        /* max-width: 14rem; */
        margin: 1rem auto;
        line-height: 1.35;
    }
    :global(.forecast) {
        margin: 0;
        padding: 0.3rem;
        background-color: #eee;
        font: 1rem "Fira Sans", sans-serif;
    }

    /* :global(.forecast) > h1, */
    :global(.day-forecast) {
        margin: 0.5rem;
        padding: 0.3rem;
        font-size: 1.2rem;
    }

    /*Place SVG to right side of a card*/
    /* :global(.day-forecast) {
        background: right/contain content-box border-box no-repeat
            url("../../public/favicon.ico") white;
    } */

    /* :global(.day-forecast) > h2, */
    :global(.day-forecast) > p {
        margin: 0.2rem;
        font-size: 1rem;
    }
</style>
