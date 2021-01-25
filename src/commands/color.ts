import { Role } from 'discord.js';
import { COLORS_LIST } from './color/colors-list';
import { Command, PathRun } from './commands';


const run: PathRun<{ color: string }> = async (msg, params, bot) => {

    const color = COLORS_LIST
        .find(c => c.triggers
            .find(t => typeof t === 'string'
                ? params.color === t
                : params.color.match(t),
            ),
        );

    if (!color) {
        await msg.reply(`\`${params.color}\` n'est pas une couleur valide`);
        return;
    }

    msg.member?.roles.cache.each(async r => {
        if (r.name.match(/^color--[a-z]{1,10}$/))
            await msg.member?.roles.remove(r);
    });

    let role: Role | null | undefined;

    role = await msg.guild?.roles.cache.find(r => r.name === `color--${color.name}`);

    if (!role)
        role = await msg.guild?.roles.create({
            data: {
                color: color.hex,
                name: `color--${color.name}`,
                position: 0,
                permissions: 0,
            },
        });

    if (!role) {
        msg.channel.send(bot.localeService.translate('error.something went wrong', { code: 'ROLE_NOT_CREATED' }));
        return;
    }

    await msg.member?.roles.add(role);

    await msg.channel.send(`Voici du \`${color.hex}\` !`);

};


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'color',
    description: 'Permet de changer la couleur du pseudo. Ajoute également +10 en swag',
    triggers: [
        'color',
        'colour',
        'couleur',
        'col',
    ],
    removable: true,
    channel: 'commands',
    paths: [
        {
            help: '<couleur>',
            description: 'Permet de changer sa couleur',
            args: [
                { displayName: '<couleur>', argType: 'dynamic', valueName: 'color', valueType: 'string' },
            ],
            run,
        },
    ],
};


export { properties };
