import { createCanvas } from 'canvas';
import writePng from './helper/write-png';
import placeSquareImage from './helper/place-square-image';
import moment from 'moment';
import LocaleService from '../services/LocaleService';

moment.locale('FR');

export interface Stats {
    name: string,
    avatarURL?: string,
    memberFor?: number,
    messages: number,
    commands: number,
    xp: number,
    level?: number,
    levelProgression?: number,
    members?: number,
}

export default async function createStats(stats: Stats, ls: LocaleService): Promise<string> {

    stats.level = Math.floor(stats.xp / 250);
    stats.levelProgression = (stats.xp - (250 * stats.level)) / 250;

    const canvas = createCanvas(500, 250);
    const ctx = canvas.getContext('2d');

    if (stats.avatarURL) {
        // Put black avatar background
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(70, 70, 48, 0, 7.853981633974483);
        ctx.fill();

        // Put avatar
        await placeSquareImage(stats.avatarURL, ctx, 20, 20, 100, true);
    }

    // Make the progress bar
    ctx.fillStyle = '#4A4F58';
    ctx.fillRect(50, 140 - 4, 400, 8);

    // Write information
    ctx.fillStyle = '#fc6b03';
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    // Header
    const headerX = stats.avatarURL ? 140 : 20;
    ctx.fillText(stats.name, headerX, 45, 360);
    ctx.font = '24px sans-serif';
    if (stats.memberFor)
        ctx.fillText(ls.translate('canvas.member since', { date: moment.duration(stats.memberFor).humanize() }), headerX, 95, 360);
    else if (stats.members)
        ctx.fillText(ls.translate('canvas.member', { count: stats.members }), headerX, 95, 360);
    // Progress bar
    ctx.fillRect(50, 140 - 4, stats.levelProgression * 400, 8);
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(stats.level.toString(), 30, 140, 30);
    ctx.textAlign = 'left';
    ctx.fillText((stats.level + 1).toString(), 470, 140, 30);
    //Stats
    ctx.font = '20px sans-serif';
    ctx.fillText(`${stats.xp} XP`, 20, 180, 220);
    ctx.fillText(ls.translate('canvas.level', { level: stats.level }), 20, 220, 220);
    ctx.fillText(ls.translate('canvas.message', { level: stats.messages }), 250, 180, 220);
    ctx.fillText(ls.translate('canvas.command', { level: stats.commands }), 250, 220, 220);
    // ctx.fillText('N°2 du serveur', 250, 220, 220);  // TODO: Get position

    return await writePng(canvas);

}
