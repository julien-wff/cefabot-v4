import { Request, Response } from 'express';
import Channel from '../../../../models/Channel';
import extractChannelRequestData from './helpers/extract-channel-request-data';

export default async function addChannel(req: Request, res: Response) {

    const params = extractChannelRequestData(req, res);
    if (!params) return;

    const existingChannel = await Channel.findOne(params);
    if (existingChannel) {
        res.status(400).json({ error: 'A channel with the same params already exists.' });
        return;
    }

    const channel = new Channel(params);
    const result = await channel.save();

    res.json(result.toJSON());

}
