import { Schema, model, Document } from 'mongoose';

const GlobalSettingsSchema = new Schema({
    trustedAccounts: {
        type: Schema.Types.Map,
        default: {},
    },
    accessPassword: {
        type: String,
        required: true,
    },
});


export default model<Document & GlobalSettings>('GlobalSetting', GlobalSettingsSchema);

export interface GlobalSettings {
    trustedAccounts: Map<string, string>,
    accessPassword: string,
}
