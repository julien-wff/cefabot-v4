import { PathRun } from '../commands';
import BotModel from '../../models/BotModel';

const changeLang: PathRun<{ lang: string }> = async (message, params, bot) => {

    const lang = params.lang as 'fr' | 'en';

    if (![ 'fr', 'en' ].includes(lang)) {
        await message.reply(`Langue ${lang} inconnue. Essayer \`fr\` ou \`en\`.`);
        return;
    }

    await BotModel.updateOne({ _id: bot.config._id }, { $set: { lang } });
    bot.config.lang = lang;
    bot.localeService.setLocale(lang);
    await message.channel.send(bot.localeService.translate('hello'));
};

export default changeLang;
