<script lang="ts">
    import { onMount } from "svelte";
    import Checkbox from "./Checkbox.svelte";
    import ToolBox from "./ToolBox.svelte";
    import { Tool, ToolBoxEventData } from "../statics/ToolBoxEvent";
    import { Key } from "../constants/Key";
    import { utils } from "../utils/utils";

    let toolBox;
    let storageArray: documentData[] = [];
    $: storage = storageArray;

    interface documentData {
        tag: string;
        component: object;
        componentProps: object;
    }

    interface checkboxProps {
        componentId: string;
        innerText: string;
    }

    onMount(() => {
        console.log("Mounted");
    });

    function insertDocumentData(data: documentData) {
        storageArray = [...storageArray, data];
    }

    const onToolBoxEventData = (event) => {
        console.log("onToolBoxEventData");
        console.log(event);
        let eventData = event.detail as ToolBoxEventData;
        if (eventData.selectedTool === Tool.Checkbox) {
            var checkboxProps: checkboxProps = {
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
        if (event.code === Key.Enter) {
            //event.preventDefault();
            //console.log(getSelectionStart());
            console.log(recurFunction(document.getSelection().anchorNode));
        }
    };
</script>

<div contenteditable="true" on:keypress|stopPropagation={onKeyPress}>
    {#each storage as node}
        <svelte:component this={node.component} props={node.componentProps} />
    {/each}
</div>

<ToolBox
    bind:this={toolBox}
    on:message={onToolBoxEventData}
    on:focus={onToolFocus}
/>

<style>
</style>
