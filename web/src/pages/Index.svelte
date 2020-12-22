<script>
    import { getContext } from 'svelte';
    import { Link } from 'svelte-routing';
    import BotCard from '../components/bots/BotCard.svelte';
    import Loading from '../components/Loading.svelte';

    const API_ROOT = getContext('API_ROOT');

    async function getBots() {
        const req = await fetch(`${API_ROOT}/bots`);
        return await req.json();
    }
</script>

{#await getBots()}
    <Loading/>
{:then bots}
    {#each bots as bot}
        <BotCard {...bot}/>
    {/each}
    <Link to="bots/new">
        <div class="md:mx-10 md:mt-10 sm:mx-4 sm:mt-4 mx-2 mt-2 p-4 rounded bg-gray-700 hover:bg-gray-600 duration-200 text-2xl text-center cursor-pointer">
            Ajouter un bot
        </div>
    </Link>
{/await}
