export default class LocaleService {

    private i18nProvider: any;

    constructor(i18nProvider: any) {
        this.i18nProvider = i18nProvider;
    }

    /**
     * @returns {string} The current locale code
     */
    getCurrentLocale(): string {
        return this.i18nProvider.getLocale();
    }

    /**
     * @returns string[] The list of available locale codes
     */
    getLocales(): string[] {
        return this.i18nProvider.getLocales();
    }

    /**
     * @param locale The locale to set. Must be from the list of available locales.
     */
    setLocale(locale: 'en' | 'fr') {
        if (this.getLocales().indexOf(locale) !== -1) {
            this.i18nProvider.setLocale(locale);
        }
    }

    /**
     * @param string String to translate
     * @param args Extra parameters
     * @returns {string} Translated string
     */
    translate(string: string, args: any = undefined): string {
        return this.i18nProvider.__(string, args)
            .replace(/&#x60;/g, '`');
    }

}
