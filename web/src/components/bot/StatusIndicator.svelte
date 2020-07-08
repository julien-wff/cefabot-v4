<!--suppress CheckEmptyScriptTag, UnnecessaryLabelJS -->
<script>
    export let enabled = false;
    export let size = 18;

    $: color = enabled ? '#16c60c' : '#e81224';
</script>

<style>
    div {
        transform: translateY(3px);
    }
</style>

<div class="inline-block rounded-full border border-black"
     style="background-color: {color}; height: {size}px; width: {size}px"/>
