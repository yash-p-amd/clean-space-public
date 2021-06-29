<script lang="ts">
    //imports
    import ToolBox from "./ToolBox.svelte";
    import { tick } from "svelte";
    import { Tool, ToolBoxEventData } from "../statics/ToolBoxEvent";
    import { Key } from "../constants/Key";
    import { onMount } from "svelte";
    import { generateUniqueID, replaceAllRegEx } from "../utils/utils";
    import { debug } from "svelte/internal";

    //svelte constants
    //variables
    let mainHero;
    let toolBox;
    $: contentHtml = "";
    $: isToolBoxVisible = false;

    //custom functionality
    onMount(() => {
        mainHero.focus();
        const child = document.createElement("div");
        child.setAttribute("id", "Div1");
        child.textContent = "Edit me!";
        mainHero.appendChild(child);
        //contentHtml = contentHtml + child.innerHTML;
    });

    const onKeyPress = async (e) => {
        //"/"
        if (e.code === Key.slash && !e.shiftKey) {
            toggleToolBox();
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
        contentHtml = replaceAllRegEx(contentHtml, /<div><br><\/div>$/gim, "");
        contentHtml = replaceAllRegEx(
            contentHtml,
            /<div>&nbsp;<\/div>$/gim,
            ""
        );
        contentHtml = replaceAllRegEx(contentHtml, /<br>$/gim, "");

        let uID = generateUniqueID(tool);
        innerHtml = innerHtml.replaceAll("${uID}", uID);
        contentHtml = contentHtml + innerHtml;
        insertHtmlAfterSelection(innerHtml);

        await tick();

        setCaret();
    };

    function insertHtmlAfterSelection(html) {
        var sel, range, node;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = window.getSelection().getRangeAt(0);
                range.collapse(false);

                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(),
                    node,
                    lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                contentHtml =
                    range.commonAncestorContainer.parentNode.innerHTML;
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            range.collapse(false);
            range.pasteHTML(html);
        }
    }

    const setCaret = async () => {
        await tick();
        console.log(contentHtml);
        let range = document.createRange();
        let sel = window.getSelection();

        debugger;
        range.setStartAfter(
            mainHero.childNodes[mainHero.childNodes.length - 1]
        );
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    };
</script>

<!-- <svelte:window on:keydown={handleKeydown} /> -->

<div
    bind:this={mainHero}
    bind:innerHTML={contentHtml}
    on:keypress|stopPropagation={onKeyPress}
    contenteditable="true"
    class="cpd-main"
/>

<pre />
{contentHtml}

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
