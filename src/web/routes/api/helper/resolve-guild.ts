import { ChildProcess } from 'child_process';
import { BotPacket, CorePacket } from '../../../../bot/botTypes';
import { ImageSize } from 'discord.js';

export interface ResolveGuild {
    guild: {
        id: string,
        name: string,
        memberCount: number,
        ownerID: string | undefined,
        iconURL: string | null
    },
    members: {
        id: string,
        name: string,
        discriminator: string,
        roles: [],
        avatarURL: string | null,
    }[],
    channels: {
        id: string,
        name: string,
        type: string,
    }[],
    roles: {
        id: string,
        name: string,
        deleted: boolean,
        hexColor: string,
        permissions: any,
    }[],
}

const resolveGuild = (guildID: string, botID: any, iconsSize: ImageSize = 128): Promise<ResolveGuild> => new Promise((resolve, reject) => {

        const { botsProcess } = require('../../../../app');
        const botProcess = botsProcess[botID] as ChildProcess | undefined;

        if (!botProcess) {
            reject();
            return;
        }

        const errorTimeout = setTimeout(() => {
            botProcess.off('message', handleBotMessage);
            reject();
        }, 10000);

        function handleBotMessage(msg: BotPacket<ResolveGuild>) {
            if (msg.type === 'resolved-guild' && msg.data && msg.data.guild.id === guildID) {
                clearTimeout(errorTimeout);
                botProcess?.off('message', handleBotMessage);
                resolve(msg.data);
            }
        }

        botProcess.on('message', handleBotMessage);

        botProcess.send({
            type: 'resolve-guild',
            data: { guildID, iconsSize },
        } as CorePacket<{ guildID: string, iconsSize: ImageSize }>);

    },
);

export default resolveGuild;
