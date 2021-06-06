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
        var keyCode = e.code;
        if (
            keyCode === Keyboard.arrowUp ||
            keyCode === Keyboard.arrowDown ||
            keyCode === Keyboard.arrowLeft ||
            keyCode === Keyboard.arrowRight
        ) {
            return;
        }
        itSelf.blur();
    };
</script>

<select
    on:keydown={onKeyPressDocument}
    bind:this={itSelf}
    use:events
    {value}
    class="cpd-select"
    size="4"
>
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
    <option value="opel">Opel</option>
    <option value="audi">Audi</option>
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
