<script>
    export let data;
</script>

{#if data.type === 'discord-role' && data.role && data.role.name}
    <span class="{data.role.deleted ? 'line-through' : ''}"
          style="color: {data.role.hexColor}">
        @{data.role.name}
    </span>
{:else if data.type === 'string'}
    {data.value}
{:else if data.type === 'int' || data.type === 'float'}
    {data.value.toString()}
{:else}
    <pre class="inline">{data.value}</pre>
{/if}
