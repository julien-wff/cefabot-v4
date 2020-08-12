import { PathRun } from '../commands';
import { getFolderStructure } from '../../utils/get-files-recursively';
import getStorageList from './get-storage-list';

const storageList: PathRun = async (message) => {

    const storageList = getStorageList(
        getFolderStructure(process.env.STORAGE_PATH!),
    );

    if (!storageList.trim()) {
        await message.channel.send('Aucun fichier n\'est présent dans le stockage de ce bot.');
        return;
    }

    await message.channel.send(storageList, { code: true });

};

export default storageList;
