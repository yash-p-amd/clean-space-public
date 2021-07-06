<script lang="ts">
    import { onMount } from "svelte";
    import Checkbox from "./Checkbox.svelte";
    import ToolBox from "./ToolBox.svelte";
    import { Tool, ToolBoxEventData } from "../statics/ToolBoxEvent";
    import { Keys } from "../constants/Keys";
    import { utils } from "../utils/utils";
    import { count } from "../utils/store";
    import type {
        ComponentProps,
        DocumentData,
        CustomNode,
    } from "../utils/interfaces";
    import { debug, tick } from "svelte/internal";

    let toolBox;
    let storageArray: DocumentData[] = [];
    $: storage = storageArray;

    onMount(() => {
        console.log("Mounted");
    });

    function insertDocumentData(data: DocumentData) {
        storageArray = [...storageArray, data];
    }

    const onToolBoxEventData = async (event) => {
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

    function recurFunction(node: CustomNode): CustomNode {
        let nodeId = node?.id;

        if (nodeId !== undefined && nodeId.includes("comp-cpd")) {
            console.log(node.id);
            return node;
        } else {
            return recurFunction(node.parentNode);
        }
    }

    const onToolFocus = () => {
        console.log("onToolFocus");
    };

    const onKeyPress = async (event) => {
        if (event.code === Keys.Enter) {
            var lastNode = recurFunction(document.getSelection().anchorNode);
            var index = GetIndexFromStorage(lastNode.id);

            count.set(lastNode);
        }
        storage[0].componentInstance.compOnKeyPress(event);
    };

    function GetIndexFromStorage(componentId: string): number {
        storage.forEach((element, index) => {
            if (element.componentProps.componentId === componentId) {
                return index;
            }
        });
        return storage.length - 1;
    }
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
