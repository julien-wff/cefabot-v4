import { Request, Response } from 'express';
import { isMongooseID } from '../helper/isID';
import LogModel, { Log } from '../../../../models/LogModel';
import { MongooseFilterQuery, Document, Types } from 'mongoose';

interface LogsRequestParams {
    limit: number,
    offset: number,
    bots: Types.ObjectId[] | null,
    app: boolean,
    sort: 'desc' | 'asc',
}

export default async function getLogs(req: Request, res: Response) {

    let requestParams: LogsRequestParams = {
        limit: 20,
        offset: 0,
        bots: null,
        app: true,
        sort: 'asc',
    };

    if (req.query.limit) {
        let limit: any = req.query.limit;
        if (typeof limit === 'string') {
            limit = parseInt(limit);
            if (!isNaN(limit) && limit <= 100 && limit > 0) {
                requestParams.limit = limit;
            }
        }
    }

    if (req.query.offset) {
        let offset: any = req.query.offset;
        if (typeof offset === 'string') {
            offset = parseInt(offset);
            if (!isNaN(offset) && offset > 0) {
                requestParams.offset = offset;
            }
        }
    }

    if (req.query.bots) {
        let bots: any = req.query.bots;
        bots = bots.split(/,/g);
        bots = bots.filter((b: string) => isMongooseID(b));
        if (bots.length > 0)
            requestParams.bots = bots.map((b: string) => Types.ObjectId(b));
    }

    if (req.query.app) {
        let app = req.query.app;
        if (typeof app === 'string' && app === '0' || app === 'false')
            requestParams.app = false;
    }

    if (req.query.sort) {
        let sort = req.query.sort;
        if (typeof sort === 'string' && sort === 'asc' || sort === 'desc')
            requestParams.sort = sort;
    }

    let queries: MongooseFilterQuery<Document & Log>[] = [];
    if (requestParams.app)
        queries.push({
            level: 'app',
        });
    if (requestParams.bots && requestParams.bots.length > 0)
        queries.push({
            botID: {
                $in: requestParams.bots,
            },
            level: 'bot',
        });

    if (queries.length === 0) {
        res.json([]);
        return;
    }

    let logs = await LogModel
        .find({ $or: queries })
        .limit(requestParams.limit)
        .skip(requestParams.offset)
        .sort({ date: requestParams.sort });

    res.json(logs);
}
