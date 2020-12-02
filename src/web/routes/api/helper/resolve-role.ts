import { ChildProcess } from 'child_process';
import { BotPacket, CorePacket } from '../../../../bot/botTypes';
import { Role } from 'discord.js';

export type RoleResolve = { roleID: string, guildID: string };

const resolveRole = (roleID: string, guildID: string, botID: any): Promise<Role> => new Promise((resolve, reject) => {

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

        function handleBotMessage(msg: BotPacket<Role>) {
            if (msg.type === 'resolved-role' && msg.data && msg.data.id === roleID) {
                clearTimeout(errorTimeout);
                botProcess?.off('message', handleBotMessage);
                resolve(msg.data);
            }
        }

        botProcess.on('message', handleBotMessage);

        botProcess.send({ type: 'resolve-role', data: { roleID, guildID } } as CorePacket<RoleResolve>);

    },
);

export default resolveRole;
