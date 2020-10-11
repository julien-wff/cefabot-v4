<!--suppress ES6UnusedImports -->
<script>
    import { Link } from 'svelte-routing';

    export let to;
</script>

<Link {to}>
    <div class="block cursor-pointer px-2 py-1 font-semibold rounded hover:bg-gray-800">
        <slot/>
    </div>
</Link>
