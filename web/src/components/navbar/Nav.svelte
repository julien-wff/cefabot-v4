<!--suppress ES6UnusedImports -->
<script>
    import { Link } from 'svelte-routing';
    import NavLink from './NavLink.svelte';
    import ToggleButton from './ToggleButton.svelte';
    import disconnect from '../../actions/disconnect';

    let isOpen = false;

    let headerElement;

    function handleClick(e) {
        if (isOpen && !headerElement.contains(e.target))
            isOpen = false;
    }
</script>

<svelte:window on:mousedown={handleClick}/>

<header class="fixed top-0 left-0 w-full bg-gray-900 md:flex md:justify-between md:items-center md:px-4 md:py-1 z-10"
        bind:this={headerElement}>

    <div class="flex items-center justify-between px-4 py-3 md:p-0">

        <Link to="/">
            <h1 class="font-bold" on:click={() => isOpen = false}>cefabot v4 panel</h1>
        </Link>

        <div class="md:hidden">
            <button class="block text-gray-500 hover:text-white focus:text-white focus:outline-none"
                    on:click={() => isOpen = !isOpen}>
                <ToggleButton {isOpen}/>
            </button>
        </div>

    </div>

    <nav class="px-2 py-2 md:flex md:p-0 {isOpen ? 'block' : 'hidden'}" on:click={() => isOpen = false}>
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="logs">Logs</NavLink>
        <NavLink to="web-access">Accès web</NavLink>
        <NavLink to="settings">Paramètres</NavLink>
        <div
                class="cursor-pointer block px-4 py-2 font-semibold rounded text-red-500 hover:bg-gray-800"
                on:click={disconnect}>
            Se déconnecter
        </div>
    </nav>

</header>
