import { Request, Response } from 'express';
import GlobalSettings from '../../../../models/GlobalSettings';

export default async function resetPassword(req: Request, res: Response) {

    if (typeof req.body.current !== 'string' || !req.body.current.trim()) {
        res.status(400).json({ error: 'Current password is required' });
        return;
    }
    const currentPswd = req.body.current;

    if (typeof req.body.new !== 'string' || !req.body.new.trim()) {
        res.status(400).json({ error: 'New password is required' });
        return;
    }
    const newPswd = req.body.new;

    const globalSettings = await GlobalSettings.findOne();

    if (!globalSettings) {
        res.status(500).json({ error: 'Error when getting the settings' });
        return;
    }

    if (currentPswd !== globalSettings.accessPassword) {
        res.status(403).json({ error: 'Wrong password' });
        return;
    }

    await globalSettings.updateOne({ accessPassword: newPswd });

    res.json({ success: true });

}
