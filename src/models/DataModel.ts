import { model, Schema, Document } from 'mongoose';
import { decrypt, encrypt } from '../utils/crypto';

const DataSchema = new Schema({
    botID: {
        required: true,
        type: Schema.Types.ObjectId,
    },
    guildID: {
        required: true,
        type: String,
    },
    channelID: String,
    key: {
        required: true,
        type: String,
    },
    value: {
        required: true,
        type: Schema.Types.Mixed,
    },
    type: {
        type: String,
        default: 'string',
    },
    secret: Boolean,
});

// Secret values encryption and decryption

DataSchema.pre<Document & DataStorage>('save', function (next) {
    if (this.secret)
        this.value = encrypt(this.value);
    next();
});

DataSchema.post<Document & DataStorage>('init', function (doc) {
    if (doc.secret)
        doc.value = decrypt(doc.value);
});


export default model<DataStorage & Document>('Data', DataSchema);

export interface DataStorage {
    botID: any,
    guildID: string,
    channelID?: string,
    key: string,
    value: any,
    type: DataType,
    secret?: boolean,
}

export type DataType =
    'string'
    | 'boolean'
    | 'int'
    | 'float'
    | 'array'
    | 'object'
    | 'discord-role'
    | 'discord-user'
    | 'discord-channel';

export const dataTypes = [
    'string',
    'boolean',
    'int',
    'float',
    'array',
    'object',
    'discord-role',
    'discord-user',
    'discord-channel',
];
