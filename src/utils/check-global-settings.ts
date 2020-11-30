import logger from '../logs/logger';
import GlobalSettings from '../models/GlobalSettings';
import { v4 as uuid } from 'uuid';

export default async function checkGlobalSettings() {

    const currentSettings = await GlobalSettings.findOne();

    if (currentSettings)
        return;

    const accessPassword = uuid();
    const newSettings = new GlobalSettings({ accessPassword });
    logger.app.warning(
        `Global settings initialized for the first time. Default web access password is "${accessPassword}".`,
        {
            location: 'check-global-settings.ts',
        });
    await newSettings.save();

}