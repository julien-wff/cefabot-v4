import { Client } from 'discord.js';
import BotModel from '../models/BotModel';
import initDB from '../database/init';
import botLog from '../logs/bot-log';
import loadAllCommands from './helper/commands/load-all-commands';
import { Bot, BotInstance, CorePacket } from './botTypes';
import execCommand from './helper/commands/exec-command';
import execTasks from './helper/schedule/exec-tasks';
import loadAllEvents from './helper/events/load-all-events';
import handlePrivateMessage from './helper/private/handlePrivateMessage';
import handleCoreMessages from './helper/handleCoreMessages';
import LocaleService from '../services/LocaleService';
import i18nProvider from '../services/i18n-provider';
import setupStorage from './helper/setupStorage';

process.on('message', async (msg: CorePacket<string>) => {

    if (msg.type === 'start') {

        try {
            await initDB();
        } catch (e) {
            console.error(e);
        }

        startBot(msg.data)
            .catch(console.error);

    }

});


async function startBot(botId: string) {

    const config = await BotModel.findById(botId) as Bot;
    const client = new Client({});

    const localeService = new LocaleService(i18nProvider);
    localeService.setLocale(config.lang);

    await setupStorage(botId);

    await botLog('debug', `Bot ${config.name} started!`, botId);
    const commands = await loadAllCommands(config.commands, config._id);

    const bot: BotInstance = {
        client,
        config,
        commands,
        localeService,
    };


    process.on('message', msg => handleCoreMessages(msg, bot));


    client.on('ready', async () => {

        await botLog('debug', `Bot ${config.name} connected!`, botId);

        await execTasks(bot);

        loadAllEvents(bot.config.events, botId)
            .forEach(event => event.run(bot));

        if (bot.config.presence)
            client.user?.setPresence(bot.config.presence);

        // Save guilds IDs
        await BotModel.updateOne({ _id: bot.config._id }, {
            $set: { guildsID: client.guilds.cache.keyArray() },
        });

    });


    client.on('message', msg => {
        if (msg.guild)
            execCommand(msg, bot);
        else
            handlePrivateMessage(msg, bot);
    });


    client.login(config.token)
        .catch(reason => {
            botLog('error', `Unable to connect bot ${config.name}. Reason: ${reason}`, botId, {
                errorType: 'startup',
                data: reason,
                location: 'bot.ts',
            });
            process.exit(-1);
        });

}
