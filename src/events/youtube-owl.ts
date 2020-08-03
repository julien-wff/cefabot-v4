import { BotEvent, EventCancel, EventRun } from './events';
import getData from './helper/get-data';
import botLog from '../logs/bot-log';
import { BotInstance } from '../bot/botTypes';
import { DataStorage } from '../models/DataModel';
import { TextChannel } from 'discord.js';
import axios from 'axios';
import { MessageEmbed } from 'discord.js';

let botInstance: BotInstance;
let data: DataStorage[];
let interval: number;
let isLive: boolean;


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
        return botLog('error', 'Unable to find the announcement channel for the OWL', botInstance.config._id, {
            data: announcementChannelKey,
            location: 'youtube-owl.ts',
        });
    }

    const response = await axios({
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

    const live: YoutubeAPILive | undefined = response.data.items[0];

    if (!live && isLive) {

        isLive = false;
        await botInstance.client.user!.setPresence(botInstance.config.presence || {});

    } else if (live && !isLive) {

        isLive = true;
        const thumbnail = live.snippet.thumbnails.medium;
        const streamURL = `https://www.youtube.com/watch?v=${live.id.videoId}`;
        await Promise.all([
            announcementChannel.send(new MessageEmbed({
                title: 'L\'Overwatch League est en direct !',
                description: live.snippet.title,
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
        await botLog('error', dataKeys.error, bot.config._id, { location: 'youtube-owl.ts' });
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
