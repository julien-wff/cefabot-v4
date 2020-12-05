import BaseEvent, { RequiredDataKey } from './helper/BaseEvent';
import { BotInstance } from '../bot/botTypes';
import getData from './helper/get-data';
import logger from '../logs/logger';
import { properties } from './user-join-role';
import { DataStorage } from '../models/DataModel';
import { GuildMember, PartialGuildMember } from 'discord.js';
import UserStatsModel from '../models/UserStatsModel';

export default class UserJoinRole extends BaseEvent {

    name = 'user-join-role';
    requiredDataKeys = [
        {
            key: 'new-member-role-id',
            type: 'discord-role',
        },
    ] as RequiredDataKey[];


    bot: BotInstance;
    data: DataStorage[];


    async onMount(bot: BotInstance) {
        this.bot = bot;
        const gotData = await getData(bot, properties);
        if (gotData.error) {
            logger.bot.error(gotData.error, { location: 'user-join-role.ts', botID: bot.config._id });
        }
        this.data = gotData.data;
        this.bot = bot;
        bot.client.on('guildMemberAdd', this.userJoin);
    }


    onDismount() {
        this.bot.client.off('guildMemberAdd', this.userJoin);
    }


    async userJoin(member: GuildMember | PartialGuildMember) {

        const userData = await UserStatsModel.findOne({
            botID: this.bot.config._id,
            guildID: member.guild.id,
            userID: member.id,
        });

        if (userData) return;

        const roleID = this.data.find(d => d.key === 'new-member-role-id')!.value;
        const role = member
            .guild
            .roles
            .resolve(roleID);

        if (!role) {
            return logger.bot.error(
                `Impossible de trouver le role ${roleID} et de l'ajouter à ${member.displayName}`,
                { location: 'user-join-role.ts', botID: this.bot.config._id },
            );
        }

        await member.roles.add(role);

    }

}
