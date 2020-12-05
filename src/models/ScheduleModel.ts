import { Schema, model, Document } from 'mongoose';
import { MessageType, PlanName } from '../schedule/schedule';


const Schedule = new Schema({
    type: {
        type: String,
        required: true,
    },
    botID: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    guildID: String,
    channelID: String,
    messageID: String,
    userID: String,
    roleID: String,
    content: Schema.Types.Mixed,
    dueTo: {
        type: Date,
        required: true,
    },
});


export default model<ScheduleDoc>('Schedule', Schedule);

export interface InputSchedule {
    type: PlanName;
    guildID?: string;
    channelID?: string;
    messageID?: string;
    content?: MessageType;
    userID?: string;
    roleID?: string;
}

export interface Schedule extends InputSchedule {
    botID: any;
    dueTo: Date;
}

export interface ScheduleDoc extends Schedule, Document {
}
