<script>
    import { createEventDispatcher } from 'svelte';


    export let userID;
    export let username;
    export let createdAt;


    const intlOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    };


    const dispatch = createEventDispatcher();
</script>


<h3 on:click={() => dispatch('copy')}>
    Par <span title={userID}>{username}</span>,
    créé le {new Intl.DateTimeFormat('FR', intlOptions).format(new Date(createdAt))}
</h3>