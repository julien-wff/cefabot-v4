const fs = require('fs');
const path = require('path');


function copyFolder(srcFolder, destFolder) {

    srcFolder = path.resolve(__dirname, '../', srcFolder);
    destFolder = path.resolve(__dirname, '../', destFolder);

    const files = fs.readdirSync(srcFolder);

    fs.mkdirSync(destFolder, { recursive: true });

    files.forEach(file => {
        fs.copyFileSync(path.resolve(srcFolder, file), path.resolve(destFolder, file));
    });

    return files;
}

console.info('\nCopying locales...');
const locales = copyFolder('src/locales', 'lib/locales');
console.info(`${locales.length} file${locales.length > 1 ? 's' : ''} copied.`);

console.info('\nCopying views...');
const views = copyFolder('src/web/views', 'lib/web/views');
console.info(`${views.length} file${views.length > 1 ? 's' : ''} copied.`);
