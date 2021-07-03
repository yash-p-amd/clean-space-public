<script lang="ts">
    import { onMount } from "svelte";
    import Checkbox from "./Checkbox.svelte";
    import ToolBox from "./ToolBox.svelte";
    import { Tool, ToolBoxEventData } from "../statics/ToolBoxEvent";
    import { Keys } from "../constants/Keys";
    import { utils } from "../utils/utils";
    import type { ComponentProps, DocumentData } from "../utils/interfaces";

    let toolBox;
    let storageArray: DocumentData[] = [];
    $: storage = storageArray;

    onMount(() => {
        console.log("Mounted");
    });

    function insertDocumentData(data: DocumentData) {
        storageArray = [...storageArray, data];
    }

    const onToolBoxEventData = (event) => {
        let eventData = event.detail as ToolBoxEventData;
        if (eventData.selectedTool === Tool.Checkbox) {
            var checkboxProps: ComponentProps = {
                componentId: utils.generateUniqueID(Tool.Checkbox),
                innerText: "Todo",
            };

            insertDocumentData({
                tag: "checkbox",
                component: Checkbox,
                componentProps: checkboxProps,
            });
        }
    };

    function getSelectionStart() {
        var node = document.getSelection().anchorNode;
        return node.nodeType == 3 ? node.parentNode : node;
    }

    function recurFunction(node: Node): Node {
        let nodeId = node?.id;

        if (nodeId !== undefined && nodeId.includes("comp-cpd-")) {
            console.log(node.id);
            return node;
        } else {
            return recurFunction(node.parentNode);
        }
    }

    const onToolFocus = () => {
        console.log("onToolFocus");
    };

    const onKeyPress = (event) => {
        if (event.code === Keys.Enter) {
            //event.preventDefault();
            //console.log(getSelectionStart());
            console.log(recurFunction(document.getSelection().anchorNode));
        }
        storage[0].componentInstance.exportedOnKeyPress(event);
    };
</script>

<div contenteditable="true" on:keypress|stopPropagation={onKeyPress}>
    {#each storage as node, index}
        <svelte:component
            this={node.component}
            bind:this={storage[index].componentInstance}
            props={node.componentProps}
        />
    {/each}
</div>

<ToolBox
    bind:this={toolBox}
    on:message={onToolBoxEventData}
    on:focus={onToolFocus}
/>

<style>
</style>
