import { BotInstance } from '../../botTypes';
import { Message } from 'discord.js';
import { Command, CommandPath } from '../../../commands/commands';
import parseCommand from './parse-command/parse-command';
import checkUserPermissions from './parse-command/check-user-perms';
import Channel from '../../../models/Channel';
import tempMessage from '../../../utils/temp-message';
import logger from '../../../logs/logger';

export default async function execCommand(message: Message, bot: BotInstance) {

    const { content } = message;

    // If the command starting char(s) are not correct
    if (content.slice(0, bot.config.commandStart.length) !== bot.config.commandStart)
        return;

    // Get the command name
    const commandName = content
        .slice(bot.config.commandStart.length)
        .replace(/ .*/, '');

    // Get the command object
    let command: Command | undefined;
    bot.commands.forEach(cmd => {
        cmd.triggers.forEach(trigger => {
            if (commandName === trigger) {
                command = cmd;
            }
        });
    });

    // If no command is found
    if (!command)
        return;

    // Check if the command is run in the correct channel
    if (command.channel) {
        // Convert the channel to an array if it is not
        let { channel } = command;
        if (typeof channel === 'string') {
            channel = [ channel ];
        }
        // Get the channel where the message was sent
        const msgChannel = await Channel.findOne({
            botID: bot.config._id,
            guildID: message.guild!.id,
            channelID: message.channel.id,
        });
        // If the channel was not found or if the channel type is not in the allowed ones
        if (!msgChannel || !channel?.includes(msgChannel.channelType)) {
            return tempMessage(
                message, bot,
                bot.localeService.translate('error.this command cant be done in this channel'),
                '5s', true);
        }
    }

    // Check if the user has the permission to run the command
    const hasPerm = checkUserPermissions(command, message.member!, bot);
    if (!hasPerm.perm)
        return message.reply(hasPerm.error
            ? hasPerm.error
            : bot.localeService.translate('error.unable to perform the command, something went wrong', { code: 'ERR_NO_PERM' }),
        );

    // Get the getMultipleData from the string
    const parsedCommand = await parseCommand(content, command, message, bot);

    // If there is an error when parsing
    if (parsedCommand.error && (!parsedCommand.path || !(parsedCommand.path as CommandPath).continueOnError))
        return message.reply(parsedCommand.error);

    // Run the command
    parsedCommand.path.run(
        message,
        parsedCommand.params,
        bot,
    )?.catch(handleExecError);


    return;


    // Handle the error from the command execution
    function handleExecError(err: any) {
        logger.bot.error(err, { location: 'exec-command.ts', botID: bot.config._id, data: err });
    }

}
