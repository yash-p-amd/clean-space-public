<script>
    import { Keyboard } from "../constants/keyboard";
    import { ConstDocumentTools } from "../constants/documentTools";
    import DocumentTools from "./DocumentTools.svelte";

    let isToolVisible = false;
    let isToolFocused = false;
    let value = "header1";
    let itSelf;
    $: itSelfValue =
        "This is some new text,&#10;this text should be on a new line.";

    const onToolSelect = (e) => {
        value = e.target.value;
        if (value === ConstDocumentTools.header1) {
            itSelfValue = itSelfValue + "&#10;";
            itSelfValue = itSelfValue + "#";
        }
        console.log(itSelfValue);
    };
    const onToolFocus = () => {
        itSelf.blur();
        isToolFocused = true;
    };
    const onToolBlur = () => {
        itSelf.focus();
        isToolFocused = false;
        isToolVisible = false;
    };
    const onKeyPressDocument = (e) => {
        if (!e.ctrlKey && e.code === Keyboard.slash) {
            isToolVisible = isToolVisible ? false : true;
        } else {
            isToolVisible = false;
        }
        console.log(e);
    };
</script>

<div
    bind:this={itSelf}
    on:keydown={onKeyPressDocument}
    contenteditable="true"
    class="cpd-main"
>
    {itSelfValue}
</div>

{#if isToolVisible}
    <DocumentTools
        on:input={onToolSelect}
        on:focus={onToolFocus}
        on:blur={onToolBlur}
        {value}
    />
{/if}

{value}
{isToolFocused}

<style>
    .cpd-main {
        border: solid;
        background-color: #eee;
        max-width: 14rem;
        margin: 1rem auto;
        line-height: 1.35;
    }
    div {
        white-space: pre-wrap;
    }
</style>
