import { PathRun } from '../commands';

interface ChangeUsernameProps {
    name: string[];
}

const changeUsername: PathRun<ChangeUsernameProps> = async (message, params, bot) => {

    await bot.client.user?.setUsername(params.name.join(' '));

};

export default changeUsername;
