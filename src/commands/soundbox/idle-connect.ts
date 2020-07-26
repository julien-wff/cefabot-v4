import { PathRun } from '../commands';

const idleConnect: PathRun = async message => {

    if (!message.member?.voice.channel) {
        await message.channel.send('Vous devez être connecté dans un salon vocal pour effectuer cette commande.');
        return;
    }

    if (!message.member?.voice.channel.joinable) {
        await message.channel.send('Impossible de rejoindre votre salon vocal.');
        return;
    }

    try {
        await message.member.voice.channel.join();
    } catch {
        await message.channel.send('Impossible de rejoindre votre salon vocal.');
        return;
    }

};

export default idleConnect;
