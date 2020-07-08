import { model, Schema, Document } from 'mongoose';

const UserStats = new Schema({
    botID: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    guildID: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    messagesCount: {
        type: Number,
        default: 0,
    },
    commandsCount: {
        type: Number,
        default: 0,
    },
    joinDate: {
        type: Date,
        default: new Date(),
    },
    quitDate: Date,
    onServer: {
        type: Boolean,
        default: true,
    },
    bot: Boolean,
    xp: {
        type: Schema.Types.Mixed,
        default: {
            count: 0,
            lastXPMessage: new Date(),
        },
    },
});


export default model<UserStatsDoc>('UserStats', UserStats);

export interface UserStats {
    botID: any;
    guildID: string;
    userID: string;
    messagesCount: number;
    commandsCount: number;
    joinDate: Date;
    quitDate?: Date;
    onServer: boolean;
    bot?: boolean;
    xp: {
        count: number,
        lastXPMessage: Date,
    };
}

export interface UserStatsDoc extends UserStats, Document {
}
