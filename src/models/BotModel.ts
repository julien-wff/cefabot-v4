import { Schema, model, Document } from 'mongoose';
import { decrypt, encrypt } from '../utils/crypto';
import { Bot } from '../bot/botTypes';

const BotSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lang: {
        type: String,
        default: 'en',
    },
    clientID: {
        type: String,
        required: true,
    },
    enabled: {
        type: Boolean,
        default: false,
    },
    guildsID: {
        type: Array,
        default: [],
    },
    commandStart: {
        type: String,
        required: true,
    },
    commands: {
        type: Array,
        required: true,
        default: [],
    },
    events: {
        type: Array,
        required: true,
        default: [],
    },
    presence: Schema.Types.Mixed,
});

// Schema encryption and decryption

BotSchema.pre<Document & Bot>('save', function (next) {
    this.token = encrypt(this.token);
    next();
});

BotSchema.post<Document & Bot>('init', function (doc) {
    doc.token = decrypt(doc.token);
});

// Export

export default model<Document & Bot>('Bot', BotSchema);
