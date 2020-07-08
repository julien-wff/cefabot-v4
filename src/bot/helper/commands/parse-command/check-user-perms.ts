import { Command } from '../../../../commands/commands';
import { GuildMember, PermissionString } from 'discord.js';

export default function checkUserPermissions(command: Command, member: GuildMember): HasUserPerms {

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
                    error: `tu n'as pas les droits nécessaires pour faire cette commande (${command.permission})`,
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
                        error: `tu n'as pas les droits nécessaires pour faire cette commande (${perm})`,
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
