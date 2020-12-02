import { ChildProcess } from 'child_process';
import { BotPacket, CorePacket } from '../../../../bot/botTypes';
import { GuildMember } from 'discord.js';

export type MemberResolve = { memberID: string, guildID: string };

const resolveMember = (memberID: string, guildID: string, botID: any): Promise<GuildMember> => new Promise((resolve, reject) => {

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

        function handleBotMessage(msg: BotPacket<GuildMember>) {
            if (msg.type === 'resolved-member' && msg.data && msg.data.id === memberID) {
                clearTimeout(errorTimeout);
                botProcess?.off('message', handleBotMessage);
                resolve(msg.data);
            }
        }

        botProcess.on('message', handleBotMessage);

        botProcess.send({ type: 'resolve-member', data: { memberID, guildID } } as CorePacket<MemberResolve>);

    },
);

export default resolveMember;
