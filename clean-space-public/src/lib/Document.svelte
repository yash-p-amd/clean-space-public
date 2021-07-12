<script lang="ts">
    import { onMount } from "svelte";
    import CheckBox from "./components/CheckBox.svelte";
    import ToolBox from "./ToolBox.svelte";
    import { Keys } from "../constants/Keys";
    import { util } from "../utils/helper";
    import type {
        ComponentProps,
        DocumentData,
        ToolBoxEventData,
        ComponentEventData,
    } from "../utils/interfaces";
    import { Tool, ComponentEvent, ComponentPosition } from "../utils/enums";
    import { tick } from "svelte/internal";
    import { focusedComponent } from "../utils/store";
    import Header1 from "./components/headers/Header1.svelte";

    let toolBox;
    let storage: DocumentData[] = [];

    // $: storage, console.log(storage);
    // $: $caretNode && console.log($caretNode);

    let elements = {};

    $: {
        console.log($focusedComponent?.id);
    }

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

    const onToolBoxEventData = (event) => {
        let eventData = event.detail as ToolBoxEventData;
        insertComponent(ComponentPosition.InsertAtLast, eventData.selectedTool);
    };

    const onToolFocus = () => {
        //console.log("onToolFocus");
    };

    const onKeyPress = async (event) => {
        if (event.code == Keys.Enter && !event.shiftKey) {
            if ($focusedComponent?.type === Tool.Checkbox) {
                insertComponent(
                    ComponentPosition.InsertAfterCaret,
                    Tool.Checkbox
                );
            }
            event.preventDefault();
        }
    };

    const removeComponent = (id) => {
        let previousId = 0;
        storage.forEach((element, index) => {
            if (element.componentProps.id === id) {
                previousId = index - 1;
                if (previousId < 0) {
                    previousId = 0;
                }
            }
        });
        let key = storage[previousId].componentProps.id;
        storage = storage.filter((item) => item.componentProps.id !== id);
        elements[key].setFocus();
    };

    const handleMessage = (event) => {
        let eventData = event.detail as ComponentEventData;
        if (eventData.event === ComponentEvent.Delete) {
            removeComponent(eventData.id);
        }
    };

    function insertComponent(position: ComponentPosition, tool: Tool) {
        let data = componentDataFactory(tool);

        if (position === ComponentPosition.InsertAtLast) {
            storage = [...storage, data];
            return;
        }
        if (position === ComponentPosition.InsertAfterCaret) {
            let index = storage.length - 1;
            storage.forEach((ele, i) => {
                if (ele.componentProps.id === $focusedComponent.id) {
                    index = i + 1;
                }
            });
            storage.splice(index, 0, data);
            storage = storage;
        }
    }

    function componentDataFactory(tool: Tool): DocumentData {
        if (tool === Tool.Checkbox) {
            return {
                component: CheckBox,
                componentProps: {
                    id: util.generateNewId(tool),
                    innerText: "Todo",
                    index: storage.length,
                },
            };
        }
        if (tool === Tool.Header1) {
            return {
                component: Header1,
                componentProps: {
                    id: util.generateNewId(tool),
                    innerText: "Header1",
                    index: storage.length,
                },
            };
        }

        return null;
    }
</script>

<div contenteditable="true" on:keypress|stopPropagation={onKeyPress}>
    {#each storage as { component, componentProps }, index (componentProps.id)}
        <svelte:component
            this={component}
            props={componentProps}
            bind:this={elements[componentProps.id]}
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
