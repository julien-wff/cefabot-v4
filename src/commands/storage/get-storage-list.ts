import { DirStructure } from '../../utils/get-files-recursively';
import numeral from 'numeral';

export default function getStorageList(root: DirStructure[]): string {

    let result = '';

    const generateVerticalTrays = (dir: DirStructure[], path: number[]): string => {
        let trays = '';
        let currentDir = dir;
        path.forEach(p => {
            if (currentDir.length - 1 === p)
                trays += '    ';
            else
                trays += '│   ';
            if (currentDir[p].type === 'folder' && currentDir[p].children)
                currentDir = currentDir[p].children!;
        });
        return trays;
    };

    const addDirectories = (directories: DirStructure[], level = 0, path: number[] = []) => {
        directories.forEach((dir, i) => {
            result += `
${generateVerticalTrays(root, path)}\
${(directories.length > 1 && i !== directories.length - 1 ? '├' : '└')}\
───${dir.name}\
${dir.size > 0 ? ` (${numeral(dir.size).format('0.0b')})` : ''}`;
            if (dir.type === 'folder' && dir.children) {
                addDirectories(dir.children, level + 1, [ ...path, i ]);
            }
        });
    };

    addDirectories(root);

    return result;

}

/**
 Display example

 └───helper
 ├───commands
 │   └───parse-command
 ├───events
 ├───private
 └───schedule

 */
