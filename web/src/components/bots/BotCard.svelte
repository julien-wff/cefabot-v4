<!--suppress ES6UnusedImports -->
<script>
    import { Link } from 'svelte-routing';
    import StatusIndicator from '../bot/StatusIndicator.svelte';

    export let id;
    export let name;
    export let enabled;
    export let commands;
    export let events;
</script>

<Link to="bots/{id}">
    <div class="md:m-10 sm:m-4 m-2 p-4 rounded bg-gray-700 hover:bg-gray-600 duration-200 sm:flex justify-between cursor-pointer">
        <h2 class="text-2xl font-bold"><StatusIndicator size="24" {enabled}/> {name}</h2>
        <div>
            {commands.length} commande{commands.length > 1 ? 's' : ''}
            <br/>
            {events.length} évènement{events.length > 1 ? 's' : ''}
        </div>
    </div>
</Link>
