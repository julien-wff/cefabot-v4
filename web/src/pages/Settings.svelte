<script>
    import { getContext } from 'svelte';
    import { Link } from 'svelte-routing';
    import Account from '../components/settings/Account.svelte';
    import Loading from '../components/Loading.svelte';
    import { addAccount } from '../components/settings/add-account';
    import { changePassword } from '../components/settings/change-password';

    const API_ROOT = getContext('API_ROOT');

    let accounts = [];

    async function getSettings() {
        const req = await fetch(`${API_ROOT}/trusted-accounts`);
        const acc = await req.json();
        accounts = Object.entries(acc);
    }

    async function handleAddAccount() {
        await addAccount(API_ROOT);
        await getSettings();
    }
</script>

{#await getSettings()}
    <Loading/>
{:then _}
    <div class="md:mx-10 md:mt-10 sm:mx-4 sm:mt-4 m-2 p-4 bg-gray-700 rounded">

        <h3 class="font-semibold text-xl pl-2 mt-2">Ancienne version de stats (v1)</h3>
        <Link to="./import">
            <button class="bg-blue-500 px-4 py-2 rounded mt-2 ml-4">
                Importer un fichier
            </button>
        </Link>

        <h3 class="font-semibold text-xl pl-2 mt-4">Mot de passe</h3>
        <button class="bg-blue-500 px-4 py-2 rounded mt-2 ml-4" on:click={() => changePassword(API_ROOT)}>
            Changer le mot de passe
        </button>

        <h3 class="font-semibold text-xl pl-2 mt-4">Comptes administrateurs</h3>
        {#each accounts as [id, name]}
            <Account {id} {name} on:userdeleted={getSettings}/>
        {/each}
        <button class="bg-blue-500 px-4 py-2 rounded mt-2 ml-4" on:click={handleAddAccount}>
            Ajouter un compte
        </button>

    </div>
{:catch err}
    <h1>Error</h1>
    {err}
{/await}
