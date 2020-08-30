<script>
    export let text = '<error>';
    export let first = false;
    export let last = false;

    let rounded, padding;
    $: if (first && last) {
        rounded = 'rounded-t rounded-b';
        padding = 'p-2 py-1';
    } else if (first) {
        rounded = 'rounded-t';
        padding = 'p-2 pb-1';
    } else if (last) {
        rounded = 'rounded-b';
        padding = 'p-2 pt-1';
    } else {
        rounded = '';
        padding = 'px-2 py-1';
    }
</script>

<div class="hover:bg-gray-400 cursor-pointer {rounded} {padding}" on:click>
    {text}
</div>
