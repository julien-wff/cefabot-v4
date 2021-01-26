import { Request, Response } from 'express';
import WebPanelAccess from '../../models/WebPanelAccess';

export default async function disconnectRoute(req: Request, res: Response) {

    const token = req.cookies.token as string | undefined;
    if (!token) {
        sendResponse(res, 400, 'Please supply a token');
        return;
    }

    const access = await WebPanelAccess.findOne({ token });

    if (!access) {
        sendResponse(res, 401, 'Invalid token');
        return;
    }

    await access.updateOne({ active: false });

    res.clearCookie('token');
    sendResponse(res, 200);
}


function sendResponse(res: Response, code = 200, error: string | null = null) {
    res.status(code).json({ code, error });
}
