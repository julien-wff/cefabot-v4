import { PathRun } from '../commands';
import deleteMessages from './delete-messages';

interface ClearByCountParams {
    count: number;
    report?: boolean;
}

const clearByCount: PathRun<ClearByCountParams> = async (message, params) => {

    await deleteMessages(params.count + 1, message, !!params.report);

};

export default clearByCount;
