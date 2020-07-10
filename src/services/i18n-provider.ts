import i18n from 'i18n';
import path from 'path';

i18n.configure({
    locales: [ 'en', 'fr' ],
    defaultLocale: 'en',
    queryParameter: 'lang',
    directory: path.join('./', process.env.FILES_FOLDER!, 'locales'),
});

export default i18n;
