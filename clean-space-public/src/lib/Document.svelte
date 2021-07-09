<script lang="ts">
    import { onMount } from "svelte";
    import CheckBox from "./CheckBox.svelte";
    import ToolBox from "./ToolBox.svelte";
    import { Keys } from "../constants/Keys";
    import { utils } from "../utils/utils";
    import { lastUniqueId, caretComponentId } from "../utils/store";
    import type {
        ComponentProps,
        DocumentData,
        CustomNode,
        ToolBoxEventData,
        ComponentEventData,
    } from "../utils/interfaces";
    import { Tool, ComponentEvent } from "../utils/interfaces";
    import { debug, element, tick } from "svelte/internal";

    let toolBox;
    let storage: DocumentData[] = [];
    // $: storage, console.log(storage);

    //$: $caretNode && console.log($caretNode);

    onMount(() => {
        console.log("Mounted");
    });

    let elements = {};

    let newlyAddedEleId = "";

    const handleAdd = (data: DocumentData, index) => {
        storage.splice(index, 0, data);
        storage = storage;
        newlyAddedEleId = data.componentProps.componentId;
    };

    const handleRemove = (id) => {
        let previousId = 0;
        storage.forEach((element, index) => {
            if (element.componentProps.componentId === id) {
                previousId = index - 1;
                if (previousId < 0) {
                    previousId = 0;
                }
            }
        });

        let key = storage[previousId].componentProps.componentId;

        storage = storage.filter(
            (item) => item.componentProps.componentId !== id
        );

        console.log(storage);
        console.log(elements);

        elements[key].setFocus();
    };

    $: {
        let dirty = false;
        Object.getOwnPropertyNames(elements).forEach((key) => {
            if (elements[key] === null) {
                delete elements[key];
                dirty = true;
            }
        });
        if (dirty) {
            // force reactivity
            elements = elements;
        }
        // if (newlyAddedEleId !== "") {
        //     elements[newlyAddedEleId].setFocus();
        //     newlyAddedEleId = "";
        // }
    }

    $: {
        //console.log(elements);
        Object.getOwnPropertyNames(elements).forEach((key) => {
            //console.log(key);
        });
    }

    async function insertDocumentData(data: DocumentData) {
        storage = [...storage, data];
        await tick();
    }

    function getUniqueIdFromStore(): string {
        var uId = ($lastUniqueId + 1).toString();
        lastUniqueId.update((id) => id + 1);
        return uId;
    }

    async function spliceinsertDocumentData(
        data: DocumentData,
        caretComponentId: string
    ) {
        let index = storage.length - 1;
        storage.forEach((ele, i) => {
            if (ele.componentProps.componentId === caretComponentId) {
                index = i + 1;
            }
        });
        handleAdd(data, index);
    }

    const onToolBoxEventData = (event) => {
        let eventData = event.detail as ToolBoxEventData;
        if (eventData.selectedTool == Tool.Checkbox) {
            insertCheckBox(null);
        }
    };

    function insertCheckBox(caretComponentId) {
        var checkboxProps: ComponentProps = {
            componentId: utils.generateUniqueID(
                Tool.Checkbox,
                getUniqueIdFromStore()
            ),
            innerText: "Todo",
            index: storage.length,
        };

        let tempNode: DocumentData = {
            component: CheckBox,
            componentProps: checkboxProps,
        };

        if (caretComponentId === null) {
            insertDocumentData(tempNode);
        } else {
            spliceinsertDocumentData(tempNode, caretComponentId);
        }
    }

    const onToolFocus = () => {
        //console.log("onToolFocus");
    };

    const onKeyPress = async (event) => {
        if (event.code == Keys.Enter && !event.shiftKey) {
            event.preventDefault();
            //console.log($caretComponentId);
            insertCheckBox($caretComponentId);
        }
    };

    const handleMessage = (event) => {
        let eventData = event.detail as ComponentEventData;
        if (eventData.componentEvent === ComponentEvent.Delete) {
            handleRemove(eventData.componentId);
        }
    };
</script>

<div contenteditable="true" on:keypress|stopPropagation={onKeyPress}>
    {#each storage as { component, componentProps }, index (componentProps.componentId)}
        <svelte:component
            this={component}
            props={componentProps}
            bind:this={elements[componentProps.componentId]}
            on:message={handleMessage}
        />
    {/each}
</div>

<p>
    {storage.length} items in the list.
</p>
<p>
    {Object.keys(elements).length} bound elements.
</p>

<ToolBox
    bind:this={toolBox}
    on:message={onToolBoxEventData}
    on:focus={onToolFocus}
/>

<style>
</style>
