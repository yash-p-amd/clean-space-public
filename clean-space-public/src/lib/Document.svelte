<script lang="ts">
    import { onMount } from "svelte";
    import CheckBox from "./CheckBox.svelte";
    import ToolBox from "./ToolBox.svelte";
    import { Keys } from "../constants/Keys";
    import { util } from "../utils/helper";
    import type {
        ComponentProps,
        DocumentData,
        ToolBoxEventData,
        ComponentEventData,
    } from "../utils/interfaces";
    import { Tool, ComponentEvent } from "../utils/enums";
    import { tick } from "svelte/internal";
    import { focusedComponent } from "../utils/store";

    let toolBox;
    let storage: DocumentData[] = [];

    // $: storage, console.log(storage);
    // $: $caretNode && console.log($caretNode);

    let elements = {};

    const handleAdd = (data: DocumentData, index) => {
        storage.splice(index, 0, data);
        storage = storage;
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
            elements = elements;
        }
    }

    $: {
        Object.getOwnPropertyNames(elements).forEach((key) => {
            //console.log(key);
        });
    }

    async function insertDocumentData(data: DocumentData) {
        storage = [...storage, data];
        await tick();
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
            componentId: util.generateNewId(Tool.Checkbox),
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
            if ($focusedComponent !== null) {
                event.preventDefault();
                insertCheckBox($focusedComponent.id);
            }
        }
    };

    const handleMessage = (event) => {
        let eventData = event.detail as ComponentEventData;
        if (eventData.event === ComponentEvent.Delete) {
            handleRemove(eventData.id);
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

<ToolBox
    bind:this={toolBox}
    on:message={onToolBoxEventData}
    on:focus={onToolFocus}
/>

<style>
</style>
