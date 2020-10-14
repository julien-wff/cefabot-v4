import { Request, Response } from 'express';
import GlobalSettings from '../../../../models/GlobalSettings';

export default async function addTrustedAccount(req: Request, res: Response) {

    if (typeof req.body.id !== 'string' || !req.body.id.trim()) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }
    const userID = req.body.id;

    if (!userID.match(/\d{18}/)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
    }

    if (typeof req.body.name !== 'string' || !req.body.name.trim()) {
        res.status(400).json({ error: 'User name is required' });
        return;
    }
    const userName = req.body.name;

    const globalSettings = await GlobalSettings.findOne();

    if (!globalSettings) {
        res.status(500).json({ error: 'Error when getting the settings' });
        return;
    }

    if (globalSettings.trustedAccounts.has(userID)) {
        res.status(400).json({ error: 'This user ID is already on the list' });
        return;
    }

    globalSettings.trustedAccounts.set(userID, userName);

    await globalSettings.updateOne({ trustedAccounts: globalSettings.trustedAccounts });

    res.json({ userID, userName });

}
