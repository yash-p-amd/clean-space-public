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
        CheckboxEventData,
        ComponentInstance,
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
        if (eventData.selectedTool == Tool.Checkbox) {
            var checkboxProps: ComponentProps = {
                componentId: utils.generateUniqueID(Tool.Checkbox),
                innerText: "Todo",
            };

            insertDocumentData({
                tag: "checkbox",
                component: Checkbox,
                componentProps: checkboxProps,
                componentEvent: onCheckboxEventData,
            });
        }
    };

    function searchParentComponent(node: CustomNode): CustomNode {
        let nodeId = node?.id;
        if (nodeId !== undefined && nodeId.includes("comp-cpd")) {
            return node;
        } else {
            return searchParentComponent(node.parentNode);
        }
    }

    const onToolFocus = () => {
        //console.log("onToolFocus");
    };

    const onKeyPress = async (event) => {
        if (event.code == Keys.Enter) {
            var lastNode = searchParentComponent(
                document.getSelection().anchorNode
            );

            debugger;

            var index = GetIndexOfComponentInStorage(lastNode.id);
            count.set(lastNode);

            debugger;
            console.log(index);
            storage[index].componentInstance.compOnKeyPress(event);
            storage[index].componentInstance.compGetNode();
        }
    };

    const onCheckboxEventData = async (event) => {
        let eventData = event.detail as CheckboxEventData;
        console.log("Receiving " + eventData.sourceProps.componentId);
        //let index = GetIndexFromStorage(eventData.sourceProps.componentId);
        //console.log(index);
    };

    function GetIndexOfComponentInStorage(componentId: string): number {
        let returnIndex = storage.length - 1;
        storage.forEach((element, index) => {
            if (`comp-${element.componentProps.componentId}` === componentId) {
                returnIndex = index;
            }
        });
        return returnIndex;
    }
</script>

<div contenteditable="true" on:keypress|stopPropagation={onKeyPress}>
    {#each storage as node, index}
        <svelte:component
            this={node.component}
            bind:this={storage[index].componentInstance}
            props={node.componentProps}
            on:message={node.componentEvent}
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
