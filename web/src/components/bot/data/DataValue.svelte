<!--suppress HtmlUnknownTarget -->
<script>
    export let data;
</script>

{#if data.type === 'discord-role' && data.role && data.role.name}
    <span class="{data.role.deleted ? 'line-through' : ''}"
          style="color: {data.role.hexColor}">
        @{data.role.name}
    </span>
{:else if data.type === 'discord-channel' && data.channel && data.channel.name}
    <span class="{data.channel.deleted ? 'line-through' : ''}">
        #{data.channel.name}
    </span>
{:else if data.type === 'discord-user' && data.user && data.user.displayName}
    <span class="{data.user.deleted ? 'line-through' : ''}"
          style="color: {data.user.displayHexColor}">
        @{data.user.displayName}
    </span>
    <img src={data.user.user.displayAvatarURL} alt=" " class="h-6 w-6 rounded-full inline-block ml-1">
{:else if data.type === 'string'}
    {data.value}
{:else if data.type === 'int' || data.type === 'float'}
    {data.value.toString()}
{:else}
    <pre class="inline">{data.value}</pre>
{/if}
