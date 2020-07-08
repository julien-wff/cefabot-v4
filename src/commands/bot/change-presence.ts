import { PathRun } from '../commands';
import { PresenceData, PresenceStatusData } from 'discord.js';
import BotModel from '../../models/BotModel';

interface ChangePresenceProps {
    afk?: boolean;
    status?: string;
    activityName?: string;
    activityType?: string;
    activityUrl?: string;
    removeActivity?: boolean;
    save?: boolean;
}

type ActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING'

const changePresence: PathRun<ChangePresenceProps> = async (message, params, bot) => {

    const STATUS_TYPES = [ 'online', 'idle', 'dnd', 'invisible' ];
    const ACTIVITY_TYPES = [ 'PLAYING', 'STREAMING', 'LISTENING', 'WATCHING' ];

    let { afk, status, activityName, activityType, activityUrl, removeActivity, save } = params;

    if (status && !STATUS_TYPES.includes(status)) {
        status = undefined;
        await message.reply(
            `${status} n'est pas un status valide. Essayez un des status suivants : ${STATUS_TYPES.join(', ')}`,
        );
    }

    // Set an empty string to remove the activity
    if (removeActivity)
        activityName = '';

    if (activityType)
        activityType = activityType.toUpperCase();

    if (activityType && !ACTIVITY_TYPES.includes(activityType)) {
        activityType = undefined;
        await message.reply(
            `${activityType} n'est pas une activité valide. Essayez une des activités suivantes : ${ACTIVITY_TYPES.join(', ')}`,
        );
    }

    let presence: PresenceData = {
        afk,
        status: status as PresenceStatusData | undefined,
    };

    // Undefined activity name crashes, we have to add it only if it's set
    if (activityName)
        presence = {
            ...presence,
            activity: {
                name: activityName,
                type: activityType as ActivityType,
                url: activityUrl,
            },
        };


    await bot.client.user?.setPresence(presence);


    // If the user wants to save the getMultipleData in the db
    if (save) {
        await BotModel.updateOne(
            { _id: bot.config._id },
            {
                $set: {
                    presence: presence,
                },
            },
        );
    }

    await message.channel.send('Ok !');

};

export default changePresence;
