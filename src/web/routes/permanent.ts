import { Request, Response } from 'express';
import WebPanelAccess from '../../models/WebPanelAccess';
import ms from 'ms';
import { sendError } from '../helpers/sendError';

const TOKEN_EXPIRE_DURATION = ms('10m');

export default async function permanentRoute(req: Request, res: Response) {

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

    if (!access.permanent) {
        sendError(req, res, 'Not a permanent token', 401);
        return;
    }

    if (access.connected || access.created.getTime() + TOKEN_EXPIRE_DURATION < Date.now()) {
        sendError(req, res, 'Expired token', 401);
        return;
    }

    await access.updateOne({ connected: true, ip: req.ip });

    res
        .cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()),
        })
        .redirect(`${process.env.WEB_ROOT_PATH}/app`);
}
