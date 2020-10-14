import { Request, Response } from 'express';
import WebPanelAccess from '../../../../models/WebPanelAccess';

export async function getWebAccesses(req: Request, res: Response) {

    const webAccesses = await WebPanelAccess
        .find()
        .sort('created');

    res.json(webAccesses.map(a => ({
        userID: a.userId,
        username: a.userName,
        created: a.created.getTime(),
        connected: a.connected,
        active: a.active,
        ip: a.ip,
    })));

}
