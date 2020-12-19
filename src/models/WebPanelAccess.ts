import { model, Schema, Document } from 'mongoose';

const WebPanelAccessSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: () => new Date(),
    },
    token: {
        type: String,
        required: true,
    },
    connected: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true,
    },
    ip: String,
});

export default model<Document & WebPanelAccess>('WebPanelAccess', WebPanelAccessSchema);

export interface WebPanelAccess {
    userId: string,
    userName: string,
    created: Date,
    token: string,
    connected: boolean,
    active: boolean,
    ip?: string,
}
