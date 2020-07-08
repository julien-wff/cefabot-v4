import { PathRun } from '../commands';
import { MessageEmbed } from 'discord.js';

const allCommands: PathRun = async (message, params, bot) => {

    const { commands, config } = bot;
    const embed = new MessageEmbed()
        .setColor('#00e01c')
        .setTitle('Aide des commandes')
        .setDescription(
            `Aide à propos des ${commands.length} commandes disponibles. Faites \`${config.commandStart}help <commande>\` pour avoir plus d'informations sur une commande.`,
        );

    commands.forEach(command => {
        embed.addField(
            `${config.commandStart}${command.name}`,
            command.description,
        );
    });

    await message.channel.send(embed);

};


export default allCommands;
