import { Schema, model, Document } from 'mongoose';

const GlobalSettingsSchema = new Schema({
    trustedAccounts: {
        type: [ String ],
        default: [],
    },
    accessPassword: {
        type: String,
        required: true,
    },
});


export default model<Document & GlobalSettings>('GlobalSetting', GlobalSettingsSchema);

export interface GlobalSettings {
    trustedAccounts: string[],
    accessPassword: string,
}
