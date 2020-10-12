import 'dotenv/config';
import checkGlobalSettings from './utils/check-global-settings';
import WebServer from './web/WebServer';
import path from 'path';
import initDB from './database/init';
import { Bot, BotPacket, CorePacket } from './bot/botTypes';
import BotModel from './models/BotModel';
import { ChildProcess, fork } from 'child_process';
import setEnvVars from './utils/set-env-vars';
import verifyEnvVars from './utils/verify-env-vars';
import { existsSync, mkdirSync } from 'fs';
import logger, { alertLog } from './logs/logger';

setEnvVars();
verifyEnvVars();
process.title = 'cefabot v4';

// Creates the temp directory
const TMP_DIR = path.resolve(__dirname, '../tmp');
if (!existsSync(TMP_DIR))
    mkdirSync(TMP_DIR);

// Checks the path of bot/bot.ts
const BOT_PATH = path.resolve(`${process.env.FILES_FOLDER}/bot/bot.${process.env.FILES_EXT}`);
if (!existsSync(BOT_PATH))
    throw new Error(`Unable to find the bot.${process.env.FILES_EXT} path (${BOT_PATH} provided)`);

let webServer: WebServer;

(async function () {

    await initDB();

    webServer = new WebServer();

    logger('app', 'debug', 'Starting cefabot...');

    await checkGlobalSettings();

    const bots: Bot[] = await BotModel.find({ enabled: true });

    bots.forEach(bot => startBot(bot)
        .catch(err => handleBotManagerCrash(bot, err)),
    );

})()
    .catch(err => console.error('Error with the bot manager', err));


let lastCrashs: { [botID: string]: [ number, number | null ] } = {}; // Array: [ more recent, second more recent ]

export async function handleBotManagerCrash(bot: Bot, err: any) {

    const lastBotCrashes = lastCrashs[bot._id];

    logger('bot', 'error', err, { data: err, location: 'app.ts', botID: bot._id });

    if (!lastBotCrashes) {

        lastCrashs[bot._id] = [ Date.now(), null ];
        startBot(bot)
            .catch(err => handleBotManagerCrash(bot, err));

    } else if (!lastBotCrashes[1] || lastBotCrashes[1] < Date.now() - 10000) {

        lastCrashs[bot._id][1] = lastBotCrashes[0];
        lastCrashs[bot._id][0] = Date.now();
        startBot(bot)
            .catch(err => handleBotManagerCrash(bot, err));

    } else {

        lastCrashs[bot._id][1] = lastBotCrashes[0];
        lastCrashs[bot._id][0] = Date.now();

        logger(
            'bot',
            'error',
            `The bot ${bot.name} crashes too many times, please check the error and restart it manually`,
            { data: err, location: 'app.ts', botID: bot._id },
        );

    }

}


export let botsProcess: { [botID: string]: ChildProcess } = {};

export async function startBot(bot: Bot) {

    const botProcess = fork(
        BOT_PATH,
        [],
        {
            silent: true,
            env: {
                ...process.env,
                FORK: '1',
            },
        },
    );

    botsProcess[bot._id] = botProcess;

    botProcess.send({ type: 'start', data: bot._id } as CorePacket<string>);

    botProcess.on('close', handleBotExit);
    botProcess.on('error', handleBotError);
    botProcess.on('message', handleBotMessage);
    botProcess.stderr?.on('data', (data: Buffer) => handleBotError(data.toString().trimRight()));
    botProcess.stdout?.on('data', (data: Buffer) => handleBotLog(data.toString().trimRight()));


    async function handleBotExit(code: number) {
        await logger('bot', 'error', `Bot exited with code ${code}${code !== 0 ? '. Restarting...' : '.'}`, {
            data: code,
            location: 'app.ts',
            botID: bot._id,
        });
        if (code !== 0) startBot(bot)
            .catch(err => handleBotManagerCrash(bot, err));
    }


    async function handleBotError(error: Error | string) {
        if (typeof error === 'string')
            await logger('bot', 'error', error, { botID: bot._id, location: 'app.ts' });
        else
            await logger('bot', 'error', error.message, {
                data: error.stack,
                location: 'app.ts',
                botID: bot._id,
            });
    }


    async function handleBotLog(message: string) {
        await logger('bot', 'log', message, { botID: bot._id, location: 'app.ts' });
    }


    function handleBotMessage(msg: BotPacket) {

        switch (msg.type) {
            case 'reboot':
                rebootBot();
                break;
            case 'log':
                alertLog();
                break;
        }

    }


    async function rebootBot() {

        await logger('bot', 'log', 'Bot restart requested', { location: 'core.js', botID: bot._id });


        botProcess.send('reboot');

        setTimeout(() => botProcess.kill(), 1000);

        botProcess.removeAllListeners();
        botProcess.stderr?.removeAllListeners();
        botProcess.stdout?.removeAllListeners();

        startBot(bot)
            .catch(err => handleBotManagerCrash(bot, err));

    }

}
