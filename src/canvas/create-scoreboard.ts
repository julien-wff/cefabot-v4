import { createCanvas } from 'canvas';
import writePng from './helper/write-png';
import placeSquareImage from './helper/place-square-image';

export default async function createScoreboard(users: FormattedUser[]): Promise<string> {

    const canvas = createCanvas(500, 100 * users.length);
    const ctx = canvas.getContext('2d');

    // Creating gradient
    const gradient = ctx.createLinearGradient(0, 0, 420, 0);
    gradient.addColorStop(0, '#fca103');
    gradient.addColorStop(1, '#fc6b03');
    ctx.fillStyle = gradient;

    // Adding progress bars
    users.forEach((u, i) => ctx.fillRect(100, 100 * i + 65, u.percentage / 100 * 375, 6));

    // Putting the usernames and the scores
    ctx.fillStyle = '#fc6b03';
    ctx.font = '22px Sans-serif';
    users.forEach((u, i) => {
        ctx.textAlign = 'left';
        ctx.fillText(`${u.position}. ${u.name}`, 100, 100 * i + 45, 300);
        ctx.textAlign = 'right';
        ctx.fillText(u.count.toString(), 475, 100 * i + 45);
    });

    // Adding profile pictures background, in case of loading error
    ctx.fillStyle = 'black';
    users.forEach((u, i) => {
        ctx.beginPath();
        ctx.arc(50, 100 * i + 50, 28, 0, 7.853981633974483);
        ctx.fill();
    });


    const addAvatars = users.map((u, i) =>
        placeSquareImage(u.avatarURL, ctx, 20, 100 * i + 20, 60, true));

    await Promise.all(addAvatars);

    return writePng(canvas);

}


export interface FormattedUser {
    name: string,
    count: number,
    position: number,
    avatarURL: string | undefined,
    percentage: number,
}
