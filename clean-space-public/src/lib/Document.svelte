<script>
    import { Keyboard } from "../constants/keyboard";
    import Select from "./Select.svelte";

    let isSelectVisible = false;

    let value = "test";
    let isFocused = false;
    const onInput = (e) => (value = e.target.value);
    const onFocus = () => (isFocused = true);
    const onBlur = () => (isFocused = false);

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
        console.log(isSelectVisible);
        console.log(keyCode);
    };
</script>

<div contenteditable="true" class="cpd-main" on:keydown={onKeyPressDocument}>
    Edit me
</div>

{#if isSelectVisible}
    <Select on:input={onInput} on:focus={onFocus} on:blur={onBlur} {value} />
    {value}
    {isFocused}
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
