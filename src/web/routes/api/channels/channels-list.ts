import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import ChannelModel from '../../../../models/Channel';
import resolveChannel from '../helper/resolve-channel';

export default async function channelsList(req: Request, res: Response) {

    if (typeof req.query.bot !== 'string') {
        res.status(400).json({ error: 'Query param `bot` not found' });
        return;
    }

    const botID = req.query.bot;

    if (!isValidObjectId(botID)) {
        res.status(400).json({ error: 'Invalid query param `bot`: not a valid mongoose ID' });
        return;
    }

    const channels = await ChannelModel.find({ botID });

    const hydratedChannels = channels.map(async c => {
        try {
            return {
                ...(c.toJSON()),
                channel: await resolveChannel(c.channelID, c.guildID, c.botID),
            };
        } catch (e) {
            return c;
        }
    });

    res.json(await Promise.all(hydratedChannels));

}
