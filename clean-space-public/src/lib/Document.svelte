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
    //let trackLastElement: Tool = Tool.None;
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

    // function (event) {
    // 	key = event.key;
    // 	keyCode = event.keyCode;
    // }

    const handleKeydown = (e) => {
        if (
            e.code === Key.arrowUp ||
            e.code === Key.arrowDown ||
            e.code === Key.arrowLeft ||
            e.code === Key.arrowRight
        ) {
            //debugger;
        }
    };

    const onKeyPress = async (e) => {
        //"/"
        if (e.code === Key.slash && !e.shiftKey) {
            toggleToolBox();
            return;
        }

        trackCurrentNode();

        if (e.code === Key.Enter && !e.shiftKey) {
            //await tick();
            e.preventDefault();
            insertNewLine();
        }

        //"Enter"
        // if (e.code === Key.Enter) {
        //     debugger;
        //     if (isCurrentLineEmpty()) {
        //         e.preventDefault();
        //         return;
        //     }
        //     return;
        // }

        //Checkbox -> "Enter"
        // if (
        //     e.code === Key.Enter &&
        //     !e.shiftKey &&
        //     trackLastElement === Tool.Checkbox
        // ) {
        //     e.preventDefault();
        //     insertCheckbox();
        //     return;
        // }

        //"Shift" + "Enter"
        // if (e.shiftKey && e.code === Key.Enter) {
        //     //trackLastElement = Tool.None;
        //     return;
        // }
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

        await tick();

        contentHtml = replaceAllRegEx(contentHtml, /<div><br><\/div>$/gim, "");
        contentHtml = replaceAllRegEx(
            contentHtml,
            /<div>&nbsp;<\/div>$/gim,
            ""
        );
        contentHtml = replaceAllRegEx(contentHtml, /<br>$/gim, "");

        await tick();

        let uID = generateUniqueID(tool);
        innerHtml = innerHtml.replaceAll("${uID}", uID);
        contentHtml = contentHtml + innerHtml;
        //insertTextAtCaret(innerHtml);

        contentHtml = contentHtml;
        //trackLastElement = tool;
        setCaret();
    };

    const insertNewLine = async () => {
        //setCaret();
        //contentText = contentText + `<br>`;
        //setCaret();
        // console.log(getSelectionStart());
        // var innerHtml = "<div id=${uID}>";
        //let uID = generateUniqueID(Tool.Div);
        // innerHtml = innerHtml.replaceAll("${uID}", uID);
        // mainHero.appendChild();
        // contentHtml = contentHtml + innerHtml;

        //const child = document.createElement("div");
        //child.setAttribute("id", uID);
        //child.textContent = "Test";
        //mainHero.appendChild(child);

        debugger;
        //await tick();
        //document.getElementById(uID).focus();
        insertHtmlAfterSelection("<h1>test</h1>");
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
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            range.collapse(false);
            range.pasteHTML(html);
        }
    }

    function getSelectionStart() {
        var node = document.getSelection().anchorNode;
        return node.nodeType == 3 ? node.parentNode : node;
    }

    const setCaret = async () => {
        await tick();
        console.log(contentHtml);
        let range = document.createRange();
        let sel = window.getSelection();

        range.setStartAfter(
            mainHero.childNodes[mainHero.childNodes.length - 1]
        );
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    };

    function insertTextAtCaret(text) {
        var sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                //range.insertNode(document.createTextNode(text));
                //range.insertNode(document.createTextNode(text));
                //range.insertNode(text);
                //range.insertNode(document.createElement(text));
                var div = document.createElement("div");
                console.log(text.trim());
                div.innerHTML = text.trim();
                console.log(range);
                range.insertNode(div);

                //debugger;

                // const newDiv = document.createElement("h1");
                // const newContent = document.createTextNode(
                //     "Hi there and greetings!"
                // );
                // newDiv.appendChild(newContent);

                // range.insertNode(newDiv);
            }
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = text;
        }
    }

    const onFocus = () => {
        // if (contentText === "") {
        //     contentText = contentText + `<div>`;
        // }
    };

    function saveSelection() {
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    }

    function restoreSelection(range) {
        if (range) {
            if (window.getSelection) {
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && range.select) {
                range.select();
            }
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
    bind:this={mainHero}
    bind:innerHTML={contentHtml}
    on:keypress|stopPropagation={onKeyPress}
    on:focus={onFocus}
    contenteditable="true"
    class="cpd-main"
    id="testid"
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
