import { Request, Response } from 'express';
import UserStatsModel from '../../../../models/UserStatsModel';


export default async function addStats(req: Request, res: Response) {
    const stats = req.body as SubmittedStats[];
    try {
        await Promise.all(
            stats.map(addBotStats),
        );
    } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
        return;
    }
    res.status(200).json({ success: true });
}


async function addBotStats({ bot, guild, stats }: SubmittedStats) {
    return Promise.all(stats.map(s => addUserStats(bot, guild, s)));
}

async function addUserStats(bot: string, guild: string, stats: SubmittedUserStats) {
    const existingUser = await UserStatsModel.findOne({ botID: bot, guildID: guild, userID: stats.id });
    if (existingUser) {
        await existingUser.updateOne({
            $inc: {
                messagesCount: parseInt(stats.messages),
                commandsCount: parseInt(stats.commands),
            },
        });
    } else {
        const newUser = new UserStatsModel({
            botID: bot,
            guildID: guild,
            userID: stats.id,
            messagesCount: parseInt(stats.messages),
            commandsCount: parseInt(stats.commands),
        });
        await newUser.save();
    }
}


interface SubmittedStats {
    name: string,
    bot: string,
    guild: string,
    stats: SubmittedUserStats[]
}

interface SubmittedUserStats {
    id: string,
    username: string,
    messages: string,
    commands: string,
    tempmutes: string,
    warns: string,
}
