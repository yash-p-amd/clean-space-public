<script lang="ts">
    import { onMount } from "svelte";
    import CheckBox from "./CheckBox.svelte";
    import ToolBox from "./ToolBox.svelte";
    import { Keys } from "../constants/Keys";
    import { utils } from "../utils/utils";
    import { caretNode, lastUniqueId, caretComponentId } from "../utils/store";
    import type {
        ComponentProps,
        DocumentData,
        CustomNode,
        CheckBoxEventData,
        ToolBoxEventData,
    } from "../utils/interfaces";
    import { Tool } from "../utils/interfaces";
    import { debug, element, tick } from "svelte/internal";

    let toolBox;
    let storage: DocumentData[] = [];
    // $: storage, console.log(storage);

    //$: $caretNode && console.log($caretNode);

    onMount(() => {
        console.log("Mounted");
    });

    let elements = {};

    const handleAdd = (data, index) => {
        storage.splice(index, 0, data);
        storage = storage;
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
        elements = elements;
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
        //debugger;
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
</script>

<div contenteditable="true" on:keypress|stopPropagation={onKeyPress}>
    <!-- {#each storage as node, index}
        <svelte:component
            this={node.component}
            bind:this={storage[index].componentInstance}
            props={node.componentProps}
        />
    {/each} -->

    {#each storage as { component, componentProps }, index (componentProps.componentId)}
        <svelte:component
            this={component}
            props={componentProps}
            bind:this={elements[componentProps.componentId]}
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
