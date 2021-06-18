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
    const setCaretTimeout = 1;
    let mainHero;
    let toolBox;
    let trackLastElement: Tool;
    $: contentText = "";
    $: isToolBoxVisible = false;

    //custom functionality
    onMount(() => {
        mainHero.focus();
    });

    const onKeyPress = async (e) => {
        console.log(e);
        //Only "/"
        if (e.code === Key.slash && !e.ctrlKey) {
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
            insertNewLine();
            return;
        }

        //Only "Enter"
        // if (e.code === Key.Enter) {
        //     debugger;
        //     insertNewLine();
        //     return;
        // }

        //debugger;
        //contentText = contentText + e.key;
        //await tick();
        //setCaret();
    };

    const onToolFocus = () => {};

    const displayToolBox = () => {
        isToolBoxVisible = true;
    };

    const hideToolBox = () => {
        isToolBoxVisible = false;
    };

    const toggleToolBox = () => {
        isToolBoxVisible = isToolBoxVisible ? false : true;
    };

    const onToolBoxEventData = async (event) => {
        let eventData = event.detail as ToolBoxEventData;
        if (eventData.selectedTool === Tool.Bullet) {
            let uID = generateUniqueID(Tool.Bullet);
            contentText = contentText + `<ul id=${uID}><li>Bullet</li></ul>`;
            trackLastElement = Tool.Bullet;
        }
        if (eventData.selectedTool === Tool.Header1) {
            let uID = generateUniqueID(Tool.Header1);
            contentText =
                contentText +
                `<h1 id=${uID} style="color: red"><span>Header1</span></h1>`;
            trackLastElement = Tool.Header1;
        }
        if (eventData.selectedTool === Tool.Header2) {
            let uID = generateUniqueID(Tool.Header2);
            contentText =
                contentText + `<h2 id=${uID} style="color: red">Header2</h2>`;
            trackLastElement = Tool.Header2;
        }
        if (eventData.selectedTool === Tool.Header3) {
            let uID = generateUniqueID(Tool.Header3);
            contentText =
                contentText + `<h3 id=${uID} style="color: red">Header3</h3>`;
            trackLastElement = Tool.Header3;
        }
        if (eventData.selectedTool === Tool.Header4) {
            let uID = generateUniqueID(Tool.Header4);
            contentText =
                contentText + `<h4 id=${uID} style="color: red">Header4</h4>`;
            trackLastElement = Tool.Header4;
        }
        if (eventData.selectedTool === Tool.Header5) {
            let uID = generateUniqueID(Tool.Header5);
            contentText =
                contentText + `<h5 id=${uID} style="color: red">Header5</h5>`;
            trackLastElement = Tool.Header5;
        }
        if (eventData.selectedTool === Tool.Header6) {
            let uID = generateUniqueID(Tool.Header6);
            contentText =
                contentText + `<h6 id=${uID} style="color: red">Header6</h6>`;
            trackLastElement = Tool.Header6;
        }
        if (eventData.selectedTool === Tool.Checkbox) {
            let uID = generateUniqueID(Tool.Checkbox);
            contentText =
                contentText +
                `<div><input id=${uID} type="checkbox"><label for=${uID}>Todo</label></div>`;
            trackLastElement = Tool.Checkbox;
        }
        mainHero.focus();
        hideToolBox();
        //setTimeout(setCaret, setCaretTimeout);
        await tick();
        setCaret();
    };

    const insertCheckbox = async () => {
        await tick();
        setCaret();
        let uID = generateUniqueID(Tool.Checkbox);
        contentText =
            contentText +
            `<div><input id=${uID} type="checkbox"><label for=${uID}>Todo</label></div>`;
        await tick();
        setCaret();
        trackLastElement = Tool.Checkbox;
    };

    const insertNewLine = async () => {
        debugger;
        setCaret();
        //contentText = contentText + `<br>`;
        //setTimeout(setCaret, setCaretTimeout);
        await tick();
        setCaret();
    };

    const setCaret = () => {
        let range = document.createRange();
        let sel = window.getSelection();

        console.log(mainHero);
        console.log(mainHero.childNodes[mainHero.childNodes.length - 1]);
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
