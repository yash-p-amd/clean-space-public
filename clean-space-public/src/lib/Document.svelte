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
        if (eventData.selectedTool === Tool.Bullet) {
            globalInsertElement(
                Tool.Bullet,
                "<ul id=${uID}><li>Bullet</li></ul>"
            );
        }
        if (eventData.selectedTool === Tool.Header1) {
            globalInsertElement(
                Tool.Header1,
                '<h1 id=${uID} style="color: red">Header1</h1>'
            );
        }
        if (eventData.selectedTool === Tool.Header2) {
            globalInsertElement(
                Tool.Header2,
                '<h2 id=${uID} style="color: red">Header2</h2>'
            );
        }
        if (eventData.selectedTool === Tool.Header3) {
            globalInsertElement(
                Tool.Header3,
                '<h3 id=${uID} style="color: red">Header3</h3>'
            );
        }
        if (eventData.selectedTool === Tool.Header4) {
            globalInsertElement(
                Tool.Header4,
                '<h4 id=${uID} style="color: red">Header4</h4>'
            );
        }
        if (eventData.selectedTool === Tool.Header5) {
            globalInsertElement(
                Tool.Header3,
                '<h5 id=${uID} style="color: red">Header5</h5>'
            );
        }
        if (eventData.selectedTool === Tool.Header6) {
            globalInsertElement(
                Tool.Header3,
                '<h6 id=${uID} style="color: red">Header6</h6>'
            );
        }
        if (eventData.selectedTool === Tool.Checkbox) {
            insertCheckbox();
        }
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
        white-space: pre-line;
        border: solid;
        background-color: #eee;
        max-width: 14rem;
        margin: 1rem auto;
        line-height: 1.35;
    }
</style>
