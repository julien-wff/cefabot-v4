import { unlinkSync } from 'fs';

const deleteFile = (path: string) => unlinkSync(path);

export default deleteFile;
