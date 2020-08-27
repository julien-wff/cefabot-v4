const fs = require('fs');
const path = require('path');
const kleur = require('kleur');

const prefix = kleur.cyan('[locales] ');

console.info(prefix + 'Copying locales...');

const srcFolder = path.resolve(__dirname, '../', 'src/locales');
const libFolder = path.resolve(__dirname, '../', 'lib/locales');

const locales = fs.readdirSync(srcFolder);

fs.mkdirSync(libFolder, { recursive: true });

locales.forEach(locale => {
    fs.copyFileSync(path.resolve(srcFolder, locale), path.resolve(libFolder, locale));
});

console.info(prefix + kleur.green(`${locales.length} file${locales.length > 1 ? 's' : ''} copied.`));
