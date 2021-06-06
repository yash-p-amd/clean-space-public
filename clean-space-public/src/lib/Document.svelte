<script>
    import { Keyboard } from "../constants/keyboard";
    import Select from "./Select.svelte";

    let isSelectVisible = false;

    let selectValue = "test";
    let isSelectFocused = false;

    const onSelectInput = (e) => (selectValue = e.target.value);
    const onFocus = () => onSelectFocus();
    const onBlur = () => onSelectBlur();

    const onKeyPressDocument = (e) => {
        var keyCode = e.code;
        if (
            keyCode === Keyboard.arrowUp ||
            keyCode === Keyboard.arrowDown ||
            keyCode === Keyboard.arrowLeft ||
            keyCode === Keyboard.arrowRight
        ) {
            return;
        }
        if (!e.ctrlKey && keyCode === Keyboard.slash) {
            isSelectVisible = isSelectVisible ? false : true;
        } else {
            isSelectVisible = false;
        }
        console.log(e);
    };

    function onSelectBlur() {
        isSelectFocused = false;
        isSelectVisible = false;
        console.log(selectValue);
        console.log("Document is in focus");
    }

    function onSelectFocus() {
        isSelectFocused = true;
        console.log("Select is in focus");
    }
</script>

<div contenteditable="true" class="cpd-main" on:keydown={onKeyPressDocument}>
    Edit me
</div>

{#if isSelectVisible}
    <Select
        on:input={onSelectInput}
        on:focus={onFocus}
        on:blur={onBlur}
        {selectValue}
    />
    {selectValue}
    {isSelectFocused}
{/if}

<style>
    .cpd-main {
        border: solid;
        background-color: #eee;
        max-width: 14rem;
        margin: 1rem auto;
        line-height: 1.35;
    }
</style>
