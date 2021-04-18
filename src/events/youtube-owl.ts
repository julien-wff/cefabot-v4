import { BotEvent, EventCancel, EventRun } from './events';
import getData from './helper/get-data';
import { BotInstance } from '../bot/botTypes';
import { DataStorage } from '../models/DataModel';
import { TextChannel } from 'discord.js';
import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import logger from '../logs/logger';

let botInstance: BotInstance;
let data: DataStorage[];
let interval: number;
let wasPreviouslyLive: boolean;


interface YoutubeAPILive {
    id: {
        videoId: string
    },
    snippet: {
        'publishedAt': string,
        'channelId': string,
        'title': string,
        'description': string,
        'thumbnails': {
            'default': {
                'url': string,
                'width': number,
                'height': number
            },
            'medium': {
                'url': string,
                'width': number,
                'height': number
            },
            'high': {
                'url': string,
                'width': number,
                'height': number
            }
        },
        'channelTitle': string,
        'liveBroadcastContent': 'live',
        'publishTime': string
    }
}


async function youtubeOWL() {
    const API_KEY = data.find(value => value.key === 'youtube-api-key')!.value;
    const CHANNEL_ID = data.find(value => value.key === 'owl-yt-channel-id')!.value;
    const announcementChannelKey = data.find(value => value.key === 'owl-announce-channel')!;
    const announcementChannel = botInstance
        .client
        .guilds
        .resolve(announcementChannelKey.guildID)
        ?.channels
        .resolve(announcementChannelKey.value) as TextChannel | null;
    if (!announcementChannel) {
        return logger.bot.error('Unable to find the announcement channel for the OWL', {
            data: announcementChannelKey,
            location: 'youtube-owl.ts',
            botID: botInstance.config._id,
        });
    }

    let response: any;
    try {
        response = await axios({
            url: 'https://www.googleapis.com/youtube/v3/search',
            params: {
                part: 'snippet',
                channelId: CHANNEL_ID,
                maxResults: 1,
                eventType: 'live',
                type: 'video',
                key: API_KEY,
            },
            responseType: 'json',
        });
    } catch (e) {
        return logger.bot.error(e, {
            data: e,
            location: 'youtube-owl.ts',
            botID: botInstance.config._id,
        });
    }

    const isLive: YoutubeAPILive | undefined = response.data.items[0];

    if (!isLive && wasPreviouslyLive) {

        wasPreviouslyLive = false;
        await botInstance.client.user!.setPresence(botInstance.config.presence || {});

    } else if (isLive && !wasPreviouslyLive) {

        wasPreviouslyLive = true;
        const thumbnail = isLive.snippet.thumbnails.medium;
        const streamURL = `https://www.youtube.com/watch?v=${isLive.id.videoId}`;
        await Promise.all([
            announcementChannel.send(new MessageEmbed({
                title: 'L\'Overwatch League est en direct !',
                description: isLive.snippet.title,
                color: '#f89c2d',
                fields: [ {
                    name: 'Regarde en direct',
                    value: streamURL,
                } ],
                thumbnail: {
                    url: thumbnail.url,
                    height: thumbnail.height,
                    width: thumbnail.width,
                },
            })),
            botInstance.client.user!.setPresence({
                activity: {
                    name: 'Overwatch League',
                    url: streamURL,
                    type: 'STREAMING',
                },
                status: 'dnd',
            }),
        ]);

    }
}


const run: EventRun = async bot => {
    const dataKeys = await getData(bot, properties);
    if (dataKeys.error) {
        logger.bot.error(dataKeys.error, { location: 'youtube-owl.ts', botID: bot.config._id });
        return dataKeys.error;
    }
    data = dataKeys.data;
    botInstance = bot;
    // @ts-ignore - Webstorm error
    interval = setInterval(youtubeOWL, 15 * 60 * 1000);
    return;
};


const cancel: EventCancel = bot => {
    botInstance = bot;
    clearInterval(interval);
};


// noinspection JSUnusedGlobalSymbols
export const properties: BotEvent = {
    name: 'youtube-owl',
    run,
    cancel,
    requiredDataKeys: [
        { key: 'youtube-api-key', type: 'string' },
        { key: 'owl-announce-channel', type: 'discord-channel' },
        { key: 'owl-yt-channel-id', type: 'string' },
    ],
};
