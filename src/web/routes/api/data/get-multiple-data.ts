import { Request, Response } from 'express';
import DataModel, { DataStorage, DataType } from '../../../../models/DataModel';
import { isMongooseID } from '../helper/isID';
import resolveRole from '../helper/resolve-role';
import resolveChannel from '../helper/resolve-channel';
import resolveMember from '../helper/resolve-member';

export default async function getMultipleData(req: Request, res: Response) {

    let filters: Partial<DataStorage & { _id: string }> = {};

    const query: Partial<DataStorage & { _id: string }> = req.query;
    if (typeof query !== 'object') {
        res.status(400).json({ error: 'Please specify a query string' });
    }

    if (typeof query.botID === 'string' && isMongooseID(query.botID)) {
        filters.botID = query.botID;
    }

    if (typeof query._id === 'string' && isMongooseID(query._id)) {
        filters._id = query._id;
    }

    const data = await DataModel.find(filters);

    const responsesPromises = await data.map(async d => {
        let dataStg: any = {
            key: d.key,
            value: d.secret ? '<secret>' : d.value,
            secret: d.secret,
            type: d.type as DataType,
            botID: d.botID,
            guildID: d.guildID,
            id: d._id,
        };
        if (dataStg.type === 'discord-role') {
            try {
                dataStg.role = await resolveRole(dataStg.value, dataStg.guildID, dataStg.botID);
            } catch {}
        }
        if (dataStg.type === 'discord-channel') {
            try {
                dataStg.channel = await resolveChannel(dataStg.value, dataStg.guildID, dataStg.botID);
            } catch {}
        }
        if (dataStg.type === 'discord-user') {
            try {
                dataStg.user = await resolveMember(dataStg.value, dataStg.guildID, dataStg.botID);
            } catch {}
        }
        return dataStg;
    });

    const responses = await Promise.all(responsesPromises);

    res.json(responses);

}
