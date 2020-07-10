import { Bot, BotInstance, BotPacket, CorePacket } from '../botTypes';
import BotModel from '../../models/BotModel';
import loadAllCommands from './commands/load-all-commands';
import getAvailableEvents from '../../commands/event/get-available-events';
import { RoleResolve } from '../../web/routes/api/helper/resolve-role';
import { ImageSize, Role } from 'discord.js';
import { ResolveGuild } from '../../web/routes/api/helper/resolve-guild';

export default async function handleCoreMessages(msg: CorePacket<any>, bot: BotInstance) {

    if (msg.type === 'reboot' || msg.type === 'shutdown') {
        bot.client.removeAllListeners();
        bot.client.destroy();
        process.exit(0);
    }

    if (msg.type === 'external-reboot') {
        process.send!({ type: 'reboot' } as BotPacket);
    }

    if (msg.type === 'reload-commands') {
        const config = await BotModel.findById(bot.config._id) as Bot;
        bot.commands = await loadAllCommands(config.commands, config._id);
        bot.config.commands = bot.commands.map(cmd => cmd.name);
    }

    if (msg.type === 'reload-events') {
        const config = await BotModel.findById(bot.config._id) as Bot;
        const availableEvents = getAvailableEvents();
        // Stop removed events
        const oldEvents = bot.config.events.filter(evt => !config.events.includes(evt));
        oldEvents.forEach(evtName => {
            availableEvents.find(e => e.name === evtName)?.cancel(bot);
        });
        // Start new events
        const newEvents = config.events.filter(evt => !bot.config.events.includes(evt));
        newEvents.forEach(evtName => {
            availableEvents.find(e => e.name === evtName)?.run(bot);
        });
        // Update config
        bot.config.events = config.events;
    }

    if (msg.type === 'resolve-role') {
        const roleData: RoleResolve = msg.data;
        const role = await bot
            .client
            .guilds
            .cache
            .get(msg.data.guildID)
            ?.roles
            .fetch(roleData.roleID)!;
        if (!role) return;
        process.send?.({
            type: 'resolved-role', data: {
                id: role.id,
                name: role.name,
                deleted: role.deleted,
                hexColor: role.hexColor,
                permissions: role.permissions,
            },
        } as BotPacket<Partial<Role>>);
    }

    if (msg.type === 'resolve-guild') {
        const { guildID, iconsSize } = msg.data as { guildID: string, iconsSize: ImageSize };
        const guild = bot.client.guilds.resolve(guildID);
        if (!guild) return;
        process.send?.({
            type: 'resolved-guild', data: {
                guild: {
                    id: guild.id,
                    name: guild.name,
                    memberCount: guild.memberCount,
                    ownerID: guild.owner!.id,
                    iconURL: guild.iconURL({ format: 'png', size: iconsSize }),
                },
                members: guild.members.cache.map(m => ({
                    id: m.user.id,
                    name: m.user.username,
                    discriminator: m.user.discriminator,
                    roles: m.roles.cache.map(r => r.id),
                    avatarURL: m.user.displayAvatarURL({ format: 'png', size: iconsSize }),
                })),
                channels: guild.channels.cache.map(c => ({
                    id: c.id,
                    name: c.name,
                    type: c.type,
                })),
                roles: guild.roles.cache.map(r => ({
                    id: r.id,
                    name: r.name,
                    deleted: r.deleted,
                    hexColor: r.hexColor,
                    permissions: r.permissions,
                })),
            },
        } as BotPacket<ResolveGuild>);
    }

}
