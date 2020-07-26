import fs from 'fs';
import path from 'path';

// interface GetFilesListRecursivelyOptions {
//     /** Regex to filter the files. */
//     fileFilter?: RegExp,
//     /** Regex to filter the whole path. */
//     pathFilter?: RegExp,
//     /** Get an absolute dir or a relative to the starting path. */
//     relative?: boolean,
//     /** The root path used to determine the relative position */
//     root?: string,
// }
//
// /**
//  * Find all files inside a dir, recursively.
//  * @function getFilesRecursively
//  * @param dir Dir path string.
//  * @param options The options object.
//  * @return Array with all file names that are inside the directory.
//  */
// export const getFilesListRecursively = (dir: string, options: GetFilesListRecursivelyOptions = {}): string[] => {
//     if (options.relative && !options.root)
//         options.root = dir;
//     return fs.readdirSync(dir).reduce((files: string[], file: string) => {
//         let name = path.join(options.relative && options.root && !path.isAbsolute(dir) ? options.root : '', dir, file);
//         // TODO: filters
//         const isDirectory = fs.statSync(name).isDirectory();
//         if (options.relative && options.root && !isDirectory)
//             name = name.replace(options.root, '');
//         return isDirectory ? [ ...files, ...getFilesListRecursively(name, options) ] : [ ...files, name ];
//     }, []);
// };


export interface DirStructure {
    /** The type of the element, file or folder. */
    type: 'file' | 'folder',
    /** The relative path of the element */
    name: string,
    /** If it's a directory, the list of the sub files / directories */
    children?: DirStructure[],
    /** The size of the file / directory */
    size: number,
}

export const getFolderStructure = (rootDir: string): DirStructure[] => {

    const walkDir = (dir: string): DirStructure[] => fs.readdirSync(dir).reduce((files, file: string) => {
        const currentDir = path.join(dir, file);
        const stats = fs.statSync(currentDir);
        const isDirectory = stats.isDirectory();
        const size = stats.size;
        const name = currentDir.split(path.sep).slice(-1)[0];

        return isDirectory
            ? [ ...files, { type: 'folder', name, children: walkDir(currentDir), size } ]
            : [ ...files, { type: 'file', name, size } ];
    }, [] as DirStructure[]);

    return walkDir(rootDir);
};
