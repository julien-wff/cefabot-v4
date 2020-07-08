import { Request, Response } from 'express';
import getBotData from '../helper/getBotData';
import { ChildProcess } from 'child_process';
import { CorePacket } from '../../../../bot/botTypes';

export default async function reboot(req: Request, res: Response) {

    const result = await getBotData(req, res, false);
    if (!result) return;
    const { bot } = result;

    const { botsProcess } = require('../../../../app');
    let botProcess = botsProcess[bot._id] as ChildProcess;

    botProcess.send({ type: 'external-reboot' } as CorePacket);

    res.status(200).json({ status: 200 });

}
