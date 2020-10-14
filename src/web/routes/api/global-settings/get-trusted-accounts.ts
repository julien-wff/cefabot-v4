import { Request, Response } from 'express';
import GlobalSettings from '../../../../models/GlobalSettings';

export default async function getTrustedAccounts(req: Request, res: Response) {

    const globalSettings = await GlobalSettings.findOne();

    if (!globalSettings) {
        res.status(500).json({ error: 'Error when getting the settings' });
        return;
    }

    res.json(globalSettings.trustedAccounts);

}
