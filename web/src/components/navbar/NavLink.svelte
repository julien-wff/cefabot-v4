<!--suppress ES6UnusedImports -->
<script>
    import { Link } from 'svelte-routing';

    export let to;
</script>

<Link {to}>
    <div class="block cursor-pointer px-4 py-2 font-semibold rounded hover:bg-gray-800">
        <slot/>
    </div>
</Link>
