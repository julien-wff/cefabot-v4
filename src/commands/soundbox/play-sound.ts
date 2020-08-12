import { PathRun } from '../commands';
import fs from 'fs';
import path from 'path';
import { VoiceConnection } from 'discord.js';

const playSound: PathRun<{ sound: string }> = async (message, params, bot) => {

    if (!message.member?.voice.channel) {
        await message.channel.send('Vous devez être connecté dans un salon vocal pour effectuer cette commande.');
        return;
    }

    if (!message.member?.voice.channel.joinable) {
        await message.channel.send('Impossible de rejoindre votre salon vocal.');
        return;
    }

    if (params.sound.match(/(\.{2,}|[<>:\/;"'\\|?*])/)) {
        await message.channel.send(`Le son \`${params.sound}\` est invalide.`);
        return;
    }

    const sound = fs
        .readdirSync(path.resolve(process.env.STORAGE_PATH!, 'soundbox'))
        .find(file => file === params.sound || file.slice(0, file.lastIndexOf('.')) === params.sound);

    if (!sound) {
        await message.channel.send(`Impossible de trouver le son \`${params.sound}\``);
        return;
    }

    const soundPath = path.resolve(process.env.STORAGE_PATH!, 'soundbox', sound);

    let disconnect = true;
    if (message.guild?.member(bot.client.user!)?.voice.channel)
        disconnect = false;

    let connection: VoiceConnection;
    try {
        connection = await message.member.voice.channel.join();
    } catch {
        await message.channel.send('Impossible de rejoindre votre salon vocal.');
        return;
    }

    const dispatcher = connection.play(soundPath);

    dispatcher.once('error', err => message.channel.send(`Une erreur est survenue : ${err.message}`));
    if (disconnect)
        dispatcher.once('finish', () => connection.disconnect());

};

export default playSound;
