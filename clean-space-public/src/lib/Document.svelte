<script lang="ts">
    import { onMount } from "svelte";
    import CheckBox from "./components/CheckBox.svelte";
    import ToolBox from "./ToolBox.svelte";
    import Text from "./components/Text.svelte";
    import { util } from "../utils/helper";
    import type {
        ComponentProps,
        DocumentData,
        ToolBoxEventData,
        ComponentEventData,
    } from "../utils/interfaces";
    import {
        Tool,
        ComponentEvent,
        ComponentPosition,
        Key,
    } from "../utils/enums";
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
        // if (event.code == Keys.Enter && !event.shiftKey) {
        //     event.preventDefault();
        //     if ($focusedComponent?.type === Tool.Checkbox) {
        //         insertComponent(
        //             ComponentPosition.InsertAfterCaret,
        //             Tool.Checkbox
        //         );
        //         return;
        //     }
        //     insertComponent(ComponentPosition.InsertAfterCaret, Tool.Text);
        //     return;
        // }
        // event.preventDefault();
        // console.log($focusedComponent);
        // console.log(elements[$focusedComponent.id]);
        //elements[$focusedComponent.id].compOnKeyPress(event);
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

        if (eventData.type === Tool.Checkbox) {
            if (eventData.event === ComponentEvent.InsertAfterCaret) {
                insertComponent(
                    ComponentPosition.InsertAfterCaret,
                    Tool.Checkbox
                );
                return;
            }
        }

        if (eventData.event === ComponentEvent.InsertAfterCaret) {
            insertComponent(ComponentPosition.InsertAfterCaret, Tool.Text);
            return;
        }

        if (eventData.event === ComponentEvent.Delete) {
            removeComponent(eventData.id);
            return;
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
                    index: storage.length,
                    type: tool,
                },
            };
        }
        if (tool === Tool.Header1) {
            return {
                component: Header1,
                componentProps: {
                    id: util.generateNewId(tool),
                    index: storage.length,
                    type: tool,
                },
            };
        }
        if (tool == Tool.Text) {
            return {
                component: Text,
                componentProps: {
                    id: util.generateNewId(tool),
                    index: storage.length,
                    type: tool,
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
