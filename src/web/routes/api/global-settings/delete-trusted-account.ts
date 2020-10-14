import { Request, Response } from 'express';
import GlobalSettings from '../../../../models/GlobalSettings';

export default async function deleteTrustedAccount(req: Request, res: Response) {

    if (typeof req.body.id !== 'string' || !req.body.id.trim()) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }
    const userID = req.body.id;

    const globalSettings = await GlobalSettings.findOne();

    if (!globalSettings) {
        res.status(500).json({ error: 'Error when getting the settings' });
        return;
    }

    if (!globalSettings.trustedAccounts.has(userID)) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    globalSettings.trustedAccounts.delete(userID);

    await globalSettings.updateOne({ trustedAccounts: globalSettings.trustedAccounts });

    res.json({ userID });

}
