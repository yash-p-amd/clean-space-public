<script>
    import { getEventsAction } from "../utils/utils";
    import { current_component } from "svelte/internal";
    import { onMount } from "svelte";
    import { Keyboard } from "../constants/keyboard";

    export let value;

    let itSelf;

    onMount(() => itSelf.focus());

    const events = getEventsAction(current_component);
    const onKeyPressDocument = (e) => {
        if (
            e.code === Keyboard.arrowUp ||
            e.code === Keyboard.arrowDown ||
            e.code === Keyboard.arrowLeft ||
            e.code === Keyboard.arrowRight
        ) {
            return;
        }
        if (e.code === Keyboard.Enter) {
            enterClicked();
        }
        itSelf.blur();
    };

    function enterClicked() {}
</script>

<select
    on:keydown={onKeyPressDocument}
    bind:this={itSelf}
    use:events
    {value}
    class="cpd-select"
    size="4"
>
    <option value="header1">Header1</option>
    <option value="header2">Header2</option>
    <option value="header3">Header3</option>
    <option value="bullet">Bullet</option>
</select>

<style>
    .cpd-select {
        overflow: auto;
        border: solid;
        background-color: #eee;
        max-width: 14rem;
        margin: 1rem auto;
        line-height: 1.35;
    }
</style>
