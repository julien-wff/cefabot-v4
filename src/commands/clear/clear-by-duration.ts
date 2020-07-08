import { PathRun } from '../commands';
import { SnowflakeUtil } from 'discord.js';
import deleteMessages from './delete-messages';

interface ClearByDurationParams {
    duration: number;
    report?: boolean;
}

const clearByDuration: PathRun<ClearByDurationParams> = async (message, params) => {

    const snowflake = SnowflakeUtil.generate(Date.now() - params.duration);
    await deleteMessages(snowflake, message, !!params.report);

};


export default clearByDuration;
