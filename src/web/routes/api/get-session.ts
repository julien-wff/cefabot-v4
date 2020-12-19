import { Request, Response } from 'express';
import WebPanelAccess from '../../../models/WebPanelAccess';

export default async function getsession(req: Request, res: Response) {

    const token = await req.cookies['token'];

    const session = await WebPanelAccess.findOne({ token });

    if (!session) {
        res.status(404).json({
            error: 'Impossible de trouver l\'utilisateur avec ce token',
        });
        return;
    }

    res.json({
        userID: session.userId,
        username: session.userName,
        created: session.created.getTime(),
        connected: session.connected,
        active: session.active,
        current: true,
        permanent: session.permanent,
        ip: session.ip,
    });

}