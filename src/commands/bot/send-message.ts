import { PathRun } from '../commands';

interface SendMessageProps {
    message: string[];
}

const sendMessage: PathRun<SendMessageProps> = async (message, params) => {

    await message.delete();
    await message.channel.send(params.message.join(' '));

};

export default sendMessage;
