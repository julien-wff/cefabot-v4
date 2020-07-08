import { MessageEmbed } from 'discord.js';
import { PathRun } from '../commands';

interface UniqueCommandProps {
    command: string;
}

const uniqueCommand: PathRun<UniqueCommandProps> = async (message, params, bot) => {

    //TODO: advanced display and path selection

    const { config, commands } = bot;
    const command = commands.find(cmd =>
        cmd.name === params.command || cmd.triggers.includes(params.command),
    );

    if (!command)
        return await message.reply(`impossible de trouver la commande ${params.command}`);

    const embed = new MessageEmbed()
        .setColor('#00e01c')
        .setTitle(`Aide sur la commande \`${config.commandStart}${command.name}\``)
        .setDescription(command.description);

    if (command.triggers && command.triggers.length > 0)
        embed.addField(
            'Alias',
            `\`${config.commandStart}${command.triggers.join(`\`, \`${config.commandStart}`)}\``,
        );

    command.paths?.forEach(path => {
            // TODO: display path flags
            embed.addField(
                `\`${config.commandStart}${command.name} ${path.help}\``,
                `${path.description}\nArguments : ${path.args.map(arg => arg.argType === 'static'
                    ? arg.triggers[0]
                    : `${arg.displayName} (${arg.valueType})`).join(', ')}`,
            );
        },
    );

    return await message.channel.send(embed);

};

export default uniqueCommand;
