<script lang="ts">
    import { onMount } from "svelte";
    import CheckBox from "./CheckBox.svelte";
    import ToolBox from "./ToolBox.svelte";
    import { Keys } from "../constants/Keys";
    import { utils } from "../utils/utils";
    import { caretNode, lastUniqueId } from "../utils/store";
    import type {
        ComponentProps,
        DocumentData,
        CustomNode,
        CheckBoxEventData,
        ComponentInstance,
        ToolBoxEventData,
    } from "../utils/interfaces";
    import { Tool } from "../utils/interfaces";
    import { debug, element, tick } from "svelte/internal";

    let toolBox;
    let storage: DocumentData[] = [];
    // $: storage, console.log(storage);

    $: $caretNode && console.log($caretNode);

    onMount(() => {
        console.log("Mounted");
    });

    let elements = {};

    let currentAdd = "";
    const handleAdd = (data) => {
        if (currentAdd === "") return;
        storage.splice(index, 0, data);
        storage = storage;
        currentAdd = "";
    };

    const handleRemove = (id) => {
        storage = storage.filter(
            (item) => item.componentProps.componentId !== id
        );
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
    }

    $: {
        console.log(elements);
    }

    async function insertDocumentData(data: DocumentData) {
        storage = [...storage, data];
        await tick();
        lastUniqueId.update((n) => n + 1);
    }

    async function spliceinsertDocumentData(data: DocumentData, index: number) {
        await tick();

        console.log(data);
        //
        //var start = storage.slice(0, index);
        //var end = storage.slice(index + 1, storage.length - 1);

        //console.log(start);
        //console.log(end);
        // storageArray = [
        //     ...storageArray.slice(0, index),
        //     data,
        //     ...storageArray.slice(index + 1, storageArray.length - 1),
        // ];
        // console.log(data);
        // storageArray = [...start, data, ...end];
        // console.log(storageArray);

        // let tempAr: DocumentData[] = [];
        // start.forEach((element) => {
        //     tempAr.push(element);
        // });
        // tempAr.push(data);
        // end.forEach((ele) => {
        //     tempAr.push(ele);
        // });

        //
        //console.log(tempAr);
        //storage = tempAr;
        await tick();

        // storage = [
        //     ...storage.slice(0, index),
        //     data,
        //     ...storage.slice(index, storage.length),
        // ];
        //storage = storage;

        storage.splice(index, 0, data);
        storage = storage;
        lastUniqueId.update((n) => n + 1);
        //

        await tick();
    }

    const onToolBoxEventData = (event) => {
        let eventData = event.detail as ToolBoxEventData;
        if (eventData.selectedTool == Tool.Checkbox) {
            insertCheckBox(null, 0);
        }
    };

    function insertCheckBox(node, caretIndex) {
        console.log(node);

        var checkboxProps: ComponentProps = {
            componentId: utils.generateUniqueID(
                Tool.Checkbox,
                ($lastUniqueId + 1).toString()
            ),
            innerText: "Todo",
        };

        let tempNode: DocumentData = {
            component: CheckBox,
            componentProps: checkboxProps,
            componentInstance: null,
        };

        //
        if (node === null) {
            insertDocumentData(tempNode);
        } else {
            spliceinsertDocumentData(tempNode, caretIndex);
        }

        lastUniqueId.update((n) => n + 1);
    }

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
        await tick();
        if (event.code == Keys.Enter && !event.shiftKey) {
            event.preventDefault();
            console.log(storage);
            let caretIndex = await searchCaretNodeIndex($caretNode);
            //console.log(`caretNode : ${caretIndex}`);
            //
            //storage[caretIndex].componentInstance.compOnKeyPress(event);

            await tick();
            if (storage[caretIndex].componentInstance !== undefined) {
                insertCheckBox(
                    storage[caretIndex].componentInstance.compGetNode(),
                    caretIndex
                );
            }

            //insertAfterNodeInStorage(caretIndex);
        }
    };

    function insertAfterNodeInStorage(index: number) {
        console.log(storage);
        var checkboxProps: ComponentProps = {
            componentId: utils.generateUniqueID(
                Tool.Checkbox,
                ($lastUniqueId + 1).toString()
            ),
            innerText: "Todo",
        };

        lastUniqueId.update((n) => n + 1);

        let tempNode = {
            component: CheckBox,
            componentProps: checkboxProps,
            componentInstance: null,
        };
        storage = [
            ...storage.slice(0, index),
            tempNode,
            ...storage.slice(index + 1),
        ];
        console.log(storage);
        console.log(storage);
        //
    }

    async function searchCaretNodeIndex(node: CustomNode): Promise<number> {
        let returnIndex = 0;
        await tick();

        storage.forEach((element, index) => {
            let tempNode: CustomNode = element.componentInstance.compGetNode();
            if (tempNode === node) {
                returnIndex = index;
            }
        });
        return returnIndex;
    }
</script>

<div contenteditable="true" on:keypress|stopPropagation={onKeyPress}>
    <!-- {#each storage as node, index}
        <svelte:component
            this={node.component}
            bind:this={storage[index].componentInstance}
            props={node.componentProps}
        />
    {/each} -->

    {#each storage as node, index}
        <svelte:component
            this={node.component}
            bind:this={elements[index]}
            props={node.componentProps}
        />
    {/each}
</div>

<ToolBox
    bind:this={toolBox}
    on:message={onToolBoxEventData}
    on:focus={onToolFocus}
/>

<!-- <script>
	import Item from './Item.svelte';
	
	let list = [];
	let elements = {};
	let lastId = 0;
	let currentAdd = '';
	
	const handleAdd = (data) => {
		if (currentAdd === '') return;
// 		list = [...list, {
// 			id: lastId++,
// 			value: currentAdd
// 		}];
		
		list.splice(2, 0, {
 			id: lastId++,
 			value: currentAdd
 		});
		list = list;
		currentAdd = '';
	};
	
	const handleRemove = (id) => {
		list = list.filter(item => item.id !== id);
	};
	
	// remove null values
	$: {
		let dirty = false;
		Object.getOwnPropertyNames(elements).forEach(key => {
			if (elements[key] === null) {
				delete elements[key];
				dirty = true;
			}
		});
		if (dirty) {
			// force reactivity
			elements = elements;
		}
	}
	debugger
	// log changes to elements
	$: console.log(elements);
</script>

<form on:submit|preventDefault={handleAdd}>
	<input type="text" bind:value={currentAdd}>
	<button>
		Add
	</button>
</form>

<p>
	{list.length} items in the list.
</p>
<p>
	{Object.keys(elements).length} bound elements.
</p>

<ul>
	{#each list as {id, value} (id)}
		<Item {id} {value} on:click={()=>handleRemove(id)} bind:this={elements[id]} />
	{/each}
</ul> 
https://svelte.dev/repl/4195f5f0ecd3430d810464ec85298a99?version=3.22.3
-->
<style>
</style>
