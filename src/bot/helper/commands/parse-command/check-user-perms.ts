import { Command } from '../../../../commands/commands';
import { GuildMember, PermissionString } from 'discord.js';
import { BotInstance } from '../../../botTypes';

export default function checkUserPermissions(command: Command, member: GuildMember, bot: BotInstance): HasUserPerms {

    if (member.guild.ownerID === member.id) // The owner has all the rights
        return {
            perm: true,
        };

    if (command.permission) {   // If the command requires permissions

        const userPerms = member.permissions.serialize();

        if (typeof command.permission === 'string') {   // If the command requires only one permission

            if (!userPerms[command.permission])
                return {
                    perm: false,
                    error: bot.localeService.translate('error.you dont have the permission to perform this command', { permission: command.permission }),
                };
            else
                return {
                    perm: true,
                };

        } else {    // If the command requires more than 1 permissions

            for (const perm of command.permission) {
                if (!userPerms[perm as PermissionString])   // If one permission is missing then the user is not authorized
                    return {
                        perm: false,
                        error: bot.localeService.translate('error.you dont have the permission to perform this command', { permission: perm }),
                    };
            }

            return {    // If the user has all the permissions he's authorized
                perm: true,
            };

        }

    } else {    // If the command requires no permissions

        return {
            perm: true,
        };

    }

}


interface HasUserPerms {
    perm: boolean;
    error?: string;
}
