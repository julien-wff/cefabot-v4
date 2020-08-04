import { DMChannel, Message } from 'discord.js';
import { BotInstance } from '../../botTypes';
import GlobalSettings from '../../../models/GlobalSettings';
import WebPanelAccess, { WebPanelAccess as WebPanelAccessType } from '../../../models/WebPanelAccess';
import { v4 as uuid } from 'uuid';
import addTask from '../../../schedule/add-task';
import logger from '../../../logs/logger';

export default async function handlePrivateMessage(message: Message, bot: BotInstance) {

    if (message.content === 'create') { // For test purposes
        const settings = new GlobalSettings({ accessPassword: 'test' });
        await settings.save();
    }

    if (message.content === 'clear') {
        const deleteMsg = await (message.channel as DMChannel).messages.fetch();
        deleteMsg.forEach(m => m.author.id === bot.client.user?.id && m.delete());
    }

    const settings = await GlobalSettings.findOne();
    if (!settings) return;

    if (message.content.match(/^web .+$/i)) {

        if (!settings.trustedAccounts.includes(message.author.id))
            return logger('app', 'warning', `${message.author.username} (${message.author.id}) tried to use web interface without permission`, {
                location: 'handlePrivateMessage.ts',
                data: { bot: bot.config._id },
                botID: bot.config._id,
            });

        const pwd = message.content.split(/^web +/)[1].trim();
        if (pwd !== settings.accessPassword)
            return logger('app', 'warning', `${message.author.username} (${message.author.id}) tried to use web interface but put the wrong password (${pwd})`, {
                location: 'handlePrivateMessage.ts',
                data: { bot: bot.config._id },
                botID: bot.config._id,
            });

        const access = new WebPanelAccess({
            userId: message.author.id,
            userName: `${message.author.username}#${message.author.discriminator}`,
            token: uuid(),
        } as WebPanelAccessType);
        await access.save();

        const URLMessage = await message.channel.send(`${process.env.WEB_BASE_URL}/connect?token=${access.token}`);

        await addTask(bot, '15s', {
            type: 'DELETE_PRIVATE_MSG',
            channelID: URLMessage.channel.id,
            messageID: URLMessage.id,
        });

    }

}
