import { GuildMember, PartialGuildMember } from 'discord.js';
import { BotInstance } from '../../bot/botTypes';
import getUser from '../helper/get-user';


export async function userQuit(member: GuildMember | PartialGuildMember, botInstance: BotInstance) {

    const user = await getUser(botInstance.config._id, member.guild.id, member.user!);

    await user.updateOne(
        {
            $set: {
                onServer: false,
                quitDate: new Date(),
            },
        },
    );

}