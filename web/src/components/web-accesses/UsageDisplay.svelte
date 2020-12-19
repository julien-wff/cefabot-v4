<script>
    export let connected = false;
    export let active = false;
</script>


<div>
    <span class="{connected ? 'text-yellow-500' : 'text-green-500'}">
        {connected ? 'Utilisé' : 'Non utilisé'},
    </span>
    <span class="{active ? 'text-yellow-500' : 'text-red-500'}">
        {active ? 'actif' : 'inactif'}
    </span>
</div>
