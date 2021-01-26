import { Request, Response } from 'express';
import WebPanelAccess from '../../models/WebPanelAccess';
import ms from 'ms';
import { sendError } from '../error/sendError';

const TOKEN_EXPIRE_DURATION = ms('1m');

export default async function connectRoute(req: Request, res: Response) {

    if (req.header('User-Agent')?.match(/discord|bot/i)) {
        res.status(418).send('You seem to be a bot. Go away!');
        return;
    }

    const token = req.query.token as string | undefined;
    if (!token) {
        sendError(req, res, 'Please supply a token', 400);
        return;
    }

    const access = await WebPanelAccess.findOne({ token });

    if (!access) {
        sendError(req, res, 'Invalid token', 401);
        return;
    }

    if (access.connected || access.created.getTime() + TOKEN_EXPIRE_DURATION < Date.now()) {
        sendError(req, res, 'Expired token', 401);
        return;
    }

    await access.updateOne({ connected: true, ip: req.ip });

    res
        .cookie('token', token, { httpOnly: true, sameSite: 'lax' })
        .redirect(`${process.env.WEB_ROOT_PATH}/app`);
}
