import { ColorResolvable } from 'discord.js';

export const COLORS_LIST: ColorName[] = [
    { name: 'blue', hex: 'BLUE', triggers: [ 'blue', /bleue?/ ] },
    { name: 'red', hex: 'RED', triggers: [ 'red', 'rouge' ] },
    { name: 'green', hex: 'GREEN', triggers: [ 'green', /verte?/ ] },
];

export interface ColorName {
    name: string,
    triggers: (string | RegExp)[],
    hex: ColorResolvable,
}