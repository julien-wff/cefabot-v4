import { Request, Response } from 'express';
import getBotData from '../helper/getBotData';
import resolveGuild from '../helper/resolve-guild';
import { ImageSize } from 'discord.js';

export default async function guild(req: Request, res: Response) {

    const reqResult = await getBotData(req, res, false);
    if (!reqResult) return;
    const { bot } = reqResult;

    const guildID = req.params?.guild;
    if (!guildID) {
        res.status(400).json({ error: 'Please supply a guild ID' });
        return;
    }

    if (!bot.guildsID.includes(guildID)) {
        res.status(404).json({ error: `Unable to find guild ${guildID} with ${bot.name} (${bot._id})` });
        return;
    }

    const iconsSize = parseInt(req.query.iconsSize as string) || 128;
    if (isNaN(iconsSize) || ![ 16, 32, 64, 128, 256, 512, 1024, 2048, 4096 ].includes(iconsSize)) {
        res.status(400).send({ error: 'Invalid icons size' });
        return;
    }

    try {
        const guild = await resolveGuild(guildID, bot._id, iconsSize as ImageSize);
        res.json(guild);
    } catch {
        res.status(404).json({ error: 'Cannot connect to the bot. Maybe it\'s offline' });
    }

}
