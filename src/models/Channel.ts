import { model, Schema, Document } from 'mongoose';

const Channel = new Schema({
    botID: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    guildID: {
        type: String,
        required: true,
    },
    channelType: {
        type: String,
        required: true,
    },
    channelID: {
        type: String,
        required: true,
    },
});

export default model<Document & Channel>('Channel', Channel);

export interface Channel {
    botID: any,
    guildID: string,
    channelType: ChannelType,
    channelID: string,
}

export const channelType = [ 'commands', 'general', 'admin', 'announces' ];
export type ChannelType = 'commands' | 'general' | 'admin' | 'announces';
