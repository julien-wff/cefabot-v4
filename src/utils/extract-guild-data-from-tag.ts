import { Message } from 'discord.js';

export function extractRoleIDFromTag(message: Message, tag: string): string | false {
    if (!tag.match(/<@&\d{18}>/))
        return false;
    const roleID = /\d{18}/.exec(tag)![0];
    const role = message.guild!.roles.cache.get(roleID);
    if (!role)
        return false;
    return role.id;
}


export function extractChannelIDFromTag(message: Message, tag: string): string | false {
    if (!tag.match(/<#\d{18}>/))
        return false;
    const channelID = /\d{18}/.exec(tag)![0];
    const channel = message.guild!.channels.cache.get(channelID);
    if (!channel)
        return false;
    return channel.id;
}

export function extractUserIDFromTag(message: Message, tag: string): string | false {
    if (!tag.match(/<@!?\d{18}>/))
        return false;
    const userID = /\d{18}/.exec(tag)![0];
    const user = message.guild!.member(userID);
    if (!user)
        return false;
    return user.id;
}
