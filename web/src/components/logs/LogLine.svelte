<!--suppress UnnecessaryLabelJS, ES6UnusedImports -->

<script context="module">
    import { writable } from 'svelte/store';
    import { sanitizeJSON } from '../../functions/sanitize';

    let detailedID = writable(null);
</script>

<script>
    import { getContext } from 'svelte';
    import { shortpress } from '../../functions/shortpress';
    import { dateFormat } from '../../functions/date-format';
    import { Link } from 'svelte-routing';

    export let _id;
    export let level;
    export let type;
    export let message;
    export let date;
    export let botID;
    export let location;
    export let data;

    let showDetails = false;

    detailedID.subscribe(id => id === _id ? showDetails = true : showDetails = false);

    let options = getContext('options');
    let selectedLogs = getContext('selected-logs');
    const bots = getContext('bots');

    let formattedDate;
    $: formattedDate = dateFormat.format(new Date(date));

    const isCheckbox = el => el?.attributes?.type?.value === 'checkbox' && el?.tagName?.toLowerCase() === 'input';

    const isAnchor = el => el?.tagName?.toLowerCase() === 'a' || el?.parentElement?.tagName?.toLowerCase() === 'a';

    function setDetailed({ explicitOriginalTarget: target }) {
        if (isCheckbox(target) || isAnchor(target))
            return;
        if ($detailedID === _id)
            $detailedID = null;
        else
            $detailedID = _id;
    }

    function updateLogSelection() {
        if ($selectedLogs.includes(_id))
            $selectedLogs = $selectedLogs.filter(l => l !== _id);
        else
            $selectedLogs = [...$selectedLogs, _id];
    }
</script>

<div class="block cursor-pointer rounded duration-100 px-1"
     class:text-gray-300={type === 'debug'}
     class:text-orange-400={type === 'warning'}
     class:text-red-400={type === 'error'}
     class:bg-gray-600={showDetails}
     class:py-1={showDetails}
     use:shortpress={300}
     on:shortpress={setDetailed}>
    {#if $options.showCheckboxes}
        <input type="checkbox" checked={$selectedLogs.includes(_id)} on:change={updateLogSelection}>
    {/if}
    {#if $options.showTime}[{formattedDate}]{/if}
    {message}
    {#if showDetails}
        <div class="block">
            Niveau : {level === 'app' ? 'application' : level}
            {#if botID}
                <span class="block">
                    Bot :
                    <span class="hover:bg-blue-400 rounded px-1">
                        <Link to="./bots/{botID}">{$bots.find(b => b.id === botID)?.name || botID}</Link>
                    </span>
                </span>
            {/if}
            {#if location}<span class="block">Location : {location}</span>{/if}
            {#if !$options.showTime}<span class="block">Heure : {formattedDate}</span>{/if}
            {#if data}<span class="block">Données : {@html sanitizeJSON(data)}</span>{/if}
        </div>
    {/if}
</div>
