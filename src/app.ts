import 'dotenv/config';
import WebServer from './web/WebServer';
import path from 'path';
import appLog from './logs/app-log';
import initDB from './database/init';
import { Bot, BotPacket, CorePacket } from './bot/botTypes';
import BotModel from './models/BotModel';
import { ChildProcess, fork } from 'child_process';
import botLog from './logs/bot-log';
import setEnvVars from './utils/set-env-vars';
import verifyEnvVars from './utils/verify-env-vars';
import { existsSync } from 'fs';

setEnvVars();
verifyEnvVars();
process.title = 'cefabot v4';

const BOT_PATH = path.resolve(`${process.env.FILES_FOLDER}/bot/bot.${process.env.FILES_EXT}`);
if (!existsSync(BOT_PATH))
    throw new Error(`Unable to find the bot.${process.env.FILES_EXT} path (${BOT_PATH} provided)`);

let webServer: WebServer;

(async function () {

    await initDB();

    webServer = new WebServer();

    await appLog('debug', 'Starting cefabot...');

    const bots: Bot[] = await BotModel.find({ enabled: true });

    bots.forEach(bot => startBot(bot)
        .catch(err => handleBotManagerCrash(bot, err)),
    );

})()
    .catch(err => console.error('Error with the bot manager', err));


let lastCrashs: { [botID: string]: [ number, number | null ] } = {}; // Array: [ more recent, second more recent ]

export async function handleBotManagerCrash(bot: Bot, err: any) {

    const lastBotCrashes = lastCrashs[bot._id];
    console.log(lastBotCrashes);

    botLog('error', err, bot._id, { data: err, location: 'app.ts' });

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

        botLog(
            'error',
            `The bot ${bot.name} crashes too many times, please check the error and restart it manually`,
            bot._id,
            { data: err, location: 'app.ts' },
        );

    }

}


export let botsProcess: { [botID: string]: ChildProcess } = {};

export async function startBot(bot: Bot) {

    const botProcess = fork(
        BOT_PATH,
        [],
        { silent: true },
    );

    botsProcess[bot._id] = botProcess;

    botProcess.send({ type: 'start', data: bot._id } as CorePacket<string>);

    botProcess.on('close', handleBotExit);
    botProcess.on('error', handleBotError);
    botProcess.on('message', handleBotMessage);
    botProcess.stderr?.on('data', (data: Buffer) => handleBotError(data.toString().trimRight()));
    botProcess.stdout?.on('data', (data: Buffer) => handleBotLog(data.toString().trimRight()));


    async function handleBotExit(code: number) {
        await botLog('error', `Bot exited with code ${code}${code !== 0 ? '. Restarting...' : '.'}`, bot, {
            errorType: 'exit',
            data: code,
            location: 'app.ts',
        });
        if (code !== 0) startBot(bot)
            .catch(err => handleBotManagerCrash(bot, err));
    }


    async function handleBotError(error: Error | string) {
        if (typeof error === 'string')
            await botLog('error', error, bot);
        else
            await botLog('error', error.message, bot, { errorType: 'log', data: error.stack, location: 'app.ts' });
    }


    async function handleBotLog(message: string) {
        await botLog('log', message, bot);
    }


    function handleBotMessage(msg: BotPacket) {

        switch (msg.type) {
            case 'reboot':
                rebootBot();
                break;
        }

    }


    async function rebootBot() {

        await botLog('log', 'Bot restart requested', bot._id, { location: 'core.js' });


        botProcess.send('reboot');

        setTimeout(() => botProcess.kill(), 1000);

        botProcess.removeAllListeners();
        botProcess.stderr?.removeAllListeners();
        botProcess.stdout?.removeAllListeners();

        startBot(bot)
            .catch(err => handleBotManagerCrash(bot, err));

    }

}
