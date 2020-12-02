import { ChildProcess } from 'child_process';
import { BotPacket, CorePacket } from '../../../../bot/botTypes';
import { GuildChannel } from 'discord.js';

export type ChannelResolve = { channelID: string, guildID: string };

const resolveChannel = (channelID: string, guildID: string, botID: any): Promise<GuildChannel> => new Promise((resolve, reject) => {

        const { botsProcess } = require('../../../../app');
        const botProcess = botsProcess[botID] as ChildProcess | undefined;

        if (!botProcess || !botProcess.connected) {
            reject();
            return;
        }

        const errorTimeout = setTimeout(() => {
            botProcess.off('message', handleBotMessage);
            reject();
        }, 10000);

        function handleBotMessage(msg: BotPacket<GuildChannel>) {
            if (msg.type === 'resolved-channel' && msg.data && msg.data.id === channelID) {
                clearTimeout(errorTimeout);
                botProcess?.off('message', handleBotMessage);
                resolve(msg.data);
            }
        }

        botProcess.on('message', handleBotMessage);

        botProcess.send({ type: 'resolve-channel', data: { channelID, guildID } } as CorePacket<ChannelResolve>);

    },
);

export default resolveChannel;
