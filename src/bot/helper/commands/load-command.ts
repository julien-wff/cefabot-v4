import { resolve } from 'path';
import { existsSync } from 'fs';
import { Command } from '../../../commands/commands';
import logger from '../../../logs/logger';

export default function loadCommand(name: string, addExt = false, botID?: any): Command | false {

    const commandPath = resolve(
        __dirname,
        `../../../commands/${name}${addExt ? `.${process.env.FILES_EXT}` : ''}`,
    );

    if (existsSync(commandPath) && commandPath.slice(-5) !== '.d.ts' && commandPath.match(/\.[tj]s$/)) {

        try {
            const command: { properties: Command } = require(commandPath);
            if (command && command.properties)
                return command.properties;
        } catch (e) {
            if (botID) logger.bot.error(`Unable to load the command ${name} : ${e}`, {
                location: 'load-command.ts',
                data: e,
                botID: botID,
            });
        }

    }

    return false;

}
