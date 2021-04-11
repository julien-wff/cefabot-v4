import { Request, Response } from 'express';
import JSZip from 'jszip';
import { Model } from 'mongoose';
import BotModel from '../../../../models/BotModel';
import ChannelModel from '../../../../models/Channel';
import DataModel from '../../../../models/DataModel';
import GlobalSettingsModel from '../../../../models/GlobalSettings';
import ScheduleModel from '../../../../models/ScheduleModel';
import UserStatsModel from '../../../../models/UserStatsModel';
import WebPanelAccessModel from '../../../../models/WebPanelAccess';


export default async function getSave(req: Request, res: Response) {
    const save = new JSZip();
    await Promise.all([
        addCollection(save, BotModel, 'bots'),
        addCollection(save, ChannelModel, 'channels'),
        addCollection(save, DataModel, 'datas'),
        addCollection(save, GlobalSettingsModel, 'globalsettings'),
        addCollection(save, ScheduleModel, 'schedules'),
        addCollection(save, UserStatsModel, 'userstats'),
        addCollection(save, WebPanelAccessModel, 'webpanelaccesses'),
    ]);
    save
        .generateAsync({ type: 'base64' })
        .then(base64 => res.send(base64));
}


async function addCollection(zip: JSZip, doc: Model<any>, name: string) {
    const entries = await doc.find();
    zip.file(`${name}.json`, JSON.stringify(entries, null, 2));
}
