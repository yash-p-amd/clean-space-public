<script>
    import { getEventsAction } from "../utils/utils";
    import { current_component } from "svelte/internal";
    import { onMount } from "svelte";
    export let value;
    const events = getEventsAction(current_component);
    let itSelf;
    onMount(() => itSelf.focus());
</script>

<!-- <input use:events {value} /> -->
<select bind:this={itSelf} use:events {value} class="cpd-select" size="4">
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
