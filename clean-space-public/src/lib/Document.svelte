<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
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
        TextEditorEvent,
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
        //console.log($focusedComponent?.id);
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

    afterUpdate(() => {
        //switch_isSelected(false);
    });

    const onToolBoxEventData = (event) => {
        let eventData = event.detail as ToolBoxEventData;
        insertComponent(ComponentPosition.InsertAtLast, eventData.selectedTool);
    };

    const onToolFocus = () => {
        //console.log("onToolFocus");
    };

    const onKeydown = (event) => {
        //console.log(event);
    };

    const onKeyup = (event) => {
        //console.log(event);
    };

    const onKeyPress = (event) => {
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

    const removeComponent = async (
        removeEvent: TextEditorEvent,
        callback: Function
    ) => {
        let siblingId = getPreviousSiblingId_isSelected(storage);
        storage = storage.filter(
            (comp) => !comp.componentProps.afterMount.isSelected
        );
        if (removeEvent === TextEditorEvent.Delete) {
            elements[siblingId].setFocus();
        }
        await tick();
        callback();
    };

    function getPreviousSiblingId_isSelected(input: DocumentData[]): string {
        let firstMatchIndex = input.findIndex(
            (ele) => ele.componentProps.afterMount.isSelected
        );
        let previousSiblingIndex =
            firstMatchIndex > 0 ? firstMatchIndex - 1 : 0;
        return input[previousSiblingIndex].componentProps.id;
    }

    const handleMessage = (event) => {
        let eventData = event.detail as ComponentEventData;

        if (
            eventData.event === TextEditorEvent.Delete ||
            eventData.event === TextEditorEvent.DeleteAll
        ) {
            removeComponent(eventData.event, () => {
                switch_isSelected(false);
            });
            return;
        }

        if (eventData.event === TextEditorEvent.SelectAll) {
            switch_isSelected(true);
            return;
        }

        if (eventData.event === TextEditorEvent.NewLine) {
            insertComponent(
                eventData.props.afterMount.insertPositionPreference,
                eventData.type
            );
        }

        if (
            eventData.event === TextEditorEvent.SelectUp ||
            eventData.event === TextEditorEvent.SelectDown
        ) {
            var index = getIndexOfSiblingComponent(eventData.event);
            var sibling = storage[index];
            elements[sibling.componentProps.id].setFocus();
            elements[sibling.componentProps.id].setIsSelected(true);
        }
    };

    function switch_isSelected(value: boolean) {
        Object.getOwnPropertyNames(elements).forEach((key) => {
            elements[key]?.setIsSelected(value);
        });
    }

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

    function getIndexOfNextNode(): number {
        let index = storage.length - 1;
        storage.forEach((ele, i) => {
            if (ele.componentProps.id === $focusedComponent.id) {
                index = i + 1;
            }
        });
        return index < 0 ? 0 : index;
    }

    function getIndexOfPreviousNode(): number {
        let index = storage.length - 1;
        storage.forEach((ele, i) => {
            if (ele.componentProps.id === $focusedComponent.id) {
                index = i - 1;
            }
        });
        return index < 0 ? 0 : index;
    }

    function getIndexOfSiblingComponent(event: TextEditorEvent): number {
        let minRange = 0;
        let maxRange = storage.length - 1;
        let index = event === TextEditorEvent.SelectUp ? minRange : maxRange;
        storage.forEach((ele, i) => {
            if (ele.componentProps.id === $focusedComponent.id) {
                index = event === TextEditorEvent.SelectUp ? i - 1 : i + 1;
            }
        });
        if (index < 0) index = minRange;
        if (index > storage.length - 1) index = maxRange;
        return index;
    }

    function componentDataFactory(tool: Tool): DocumentData {
        if (tool === Tool.Checkbox) {
            return {
                component: CheckBox,
                componentProps: {
                    id: util.generateNewId(tool),
                    index: storage.length,
                    type: tool,
                    afterMount: {
                        insertPositionPreference:
                            ComponentPosition.InsertAfterCaret,
                        isSelected: false,
                        mainNode: null,
                        eventDispatcher: null,
                    },
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
                    afterMount: {
                        insertPositionPreference:
                            ComponentPosition.InsertAfterCaret,
                        isSelected: false,
                        mainNode: null,
                        eventDispatcher: null,
                    },
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
                    afterMount: {
                        insertPositionPreference:
                            ComponentPosition.InsertAfterCaret,
                        isSelected: false,
                        mainNode: null,
                        eventDispatcher: null,
                    },
                },
            };
        }
        throw new Error(`Invalid tool : ${tool}`);
    }
</script>

<div
    contenteditable="true"
    on:keypress={onKeyPress}
    on:keydown={onKeydown}
    on:keyup={onKeyup}
>
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
