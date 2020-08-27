import { Request, Response } from 'express';
import DataModel, { DataStorage, dataTypes } from '../../../../models/DataModel';
import { isGuildID, isMongooseID } from '../helper/isID';

export default async function postData(req: Request, res: Response) {

    const data = req.body;
    let saveData: Partial<DataStorage> = {};

    if (!data) {
        res.status(400).json({ error: 'Please specify a body' });
        return;
    }

    if (!data.key || typeof data.key !== 'string' || !data.key.match(/^[a-z-]{4,30}$/)) {
        res.status(400).json({ error: 'Invalid key' });
        return;
    }
    saveData.key = data.key;

    if (!data.type || typeof data.type !== 'string' || !dataTypes.includes(data.type)) {
        res.status(400).json({ error: 'Invalid data type' });
        return;
    }
    saveData.type = data.type;

    if (!data.value) {
        res.status(400).json({ error: 'Please specify a value' });
        return;
    }
    if ((saveData.type === 'boolean' && typeof data.value !== 'boolean')
        || ((saveData.type === 'int' || saveData.type === 'float') && typeof data.value !== 'number')
        || saveData.type === 'array' && !Array.isArray(data.value)
        || saveData.type === 'object' && typeof data.value !== 'object'
        || saveData.type === 'string' && typeof data.value !== 'string') {
        res.status(400).json({ error: 'Invalid value' });
        return;
    }
    saveData.value = data.value;

    if (!data.guildID || !isGuildID(data.guildID)) {
        res.status(400).json({ error: 'Invalid guild ID' });
        return;
    }
    saveData.guildID = data.guildID;

    if (!data.botID || !isMongooseID(data.botID)) {
        res.status(400).json({ error: 'Invalid bot ID' });
        return;
    }
    saveData.botID = data.botID;

    if (typeof data.secret === 'boolean' && data.secret)
        saveData.secret = true;

    const dbSave = new DataModel(saveData);
    const dbResult = await dbSave.save();

    res.json(dbResult);

}
