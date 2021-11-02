import UserStatsModel from '../../models/UserStatsModel';
import { PathRun } from '../commands';

export const verifyStats: PathRun = async (message, params, bot) => {
    const members = await message.guild?.members.fetch();

    if (!members)
        return message.channel.send('Impossible d\'obtenir les membres.');

    await message.channel.send(`Verification de ${members.array().length} membres...`);

    const actualMembers = await UserStatsModel.find({
        botID: bot.config._id,
        guildID: message.guild!.id,
    });

    let addedMembers = await Promise
        .all(members.map(async member => {
            if (!actualMembers.find(m => m.userID === member.id)) {
                await new UserStatsModel({
                    botID: bot.config._id,
                    guildID: member.guild.id,
                    userID: member.user.id,
                    bot: member.user.bot || undefined,
                }).save();
                return true;
            }
            return false;
        }))
        .then(members => members.reduce((count, isAdded) => count + +isAdded, 0));

    if (addedMembers < 2)
        await message.channel.send(`${!addedMembers ? 'Aucun' : addedMembers} membre manquant ${!addedMembers ? `n'` : ''}a été ajouté.`);
    else
        await message.channel.send(`${addedMembers} membres manquants ont été ajoutés.`);

    return;
};
