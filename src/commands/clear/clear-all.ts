import { PathRun } from '../commands';
import deleteMessages from './delete-messages';


interface ClearAllProps {
    report?: boolean;
}

const clearAll: PathRun<ClearAllProps> = async (message, params) => {

    await deleteMessages(100, message, !!params.report);

};

export default clearAll;
