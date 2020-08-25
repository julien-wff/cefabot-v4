import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { isGuildID } from '../../helper/isID';
import { channelType } from '../../../../../models/Channel';

export default function extractChannelRequestData(req: Request, res: Response) {

    const params = {
        botID: req.body.bot,
        guildID: req.body.guild,
        channelID: req.body.channel,
        channelType: req.body.type,
    };

    if (!isValidObjectId(params.botID)) {
        res.status(400).json({ error: 'Invalid bot ID' });
        return;
    }

    if (!isGuildID(params.guildID)) {
        res.status(400).json({ error: 'Invalid guild ID' });
        return;
    }

    if (typeof params.guildID !== 'string') {
        res.status(400).json({ error: 'Invalid channel ID' });
        return;
    }

    if (!channelType.includes(params.channelType)) {
        res
            .status(400)
            .json({ error: `Invalid channel type. Valid types are ${channelType.join(', ')}. '${params.channelType}' provided` });
        return;
    }

    return params;
}
