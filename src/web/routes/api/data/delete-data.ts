import { Request, Response } from 'express';
import { isMongooseID } from '../helper/isID';
import DataModel from '../../../../models/DataModel';

export default async function deleteData(req: Request, res: Response) {

    const dataID = req.params?.dataID;
    if (!dataID) {
        res.status(400).json({ error: 'Please specify the data ID' });
        return;
    }
    if (!isMongooseID(dataID)) {
        res.status(400).json({ error: 'Invalid data ID' });
        return;
    }

    const data = await DataModel.findById(dataID);
    if (!data) {
        res.status(404).json({ error: `Can't find data with ID ${dataID}` });
        return;
    }

    await data.deleteOne();

    res.json({ status: 200 });

}
