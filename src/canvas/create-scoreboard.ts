import { UserStats } from '../models/UserStatsModel';
import { Guild } from 'discord.js';
import { createCanvas, Image } from 'canvas';
import writePng from './helper/write-png';
import placeSquareImage from './helper/place-square-image';

export default async function createScoreboard(users: UserStats[], guild: Guild): Promise<string> {

    const formattedUsers = users.map((user, ind) => ({
        name: guild.member(user.userID)!.displayName,
        messagesCount: user.messagesCount,
        position: ind + 1,
        avatarURL: guild.member(user.userID)!.user.displayAvatarURL({ size: 128, format: 'png' }),
        percentage: user.messagesCount / users[0].messagesCount * 100,
    }));

    const canvas = createCanvas(500, 100 * formattedUsers.length);
    const ctx = canvas.getContext('2d');

    // Creating gradient
    const gradient = ctx.createLinearGradient(0, 0, 420, 0);
    gradient.addColorStop(0, '#fca103');
    gradient.addColorStop(1, '#fc6b03');
    ctx.fillStyle = gradient;

    // Adding progress bars
    formattedUsers.forEach((u, i) => ctx.fillRect(100, 100 * i + 65, u.percentage / 100 * 375, 6));

    // Putting the usernames and the scores
    ctx.fillStyle = '#fc6b03';
    ctx.font = '22px Sans-serif';
    formattedUsers.forEach((u, i) => {
        ctx.textAlign = 'left';
        ctx.fillText(`${u.position}. ${u.name}`, 100, 100 * i + 45, 300);
        ctx.textAlign = 'right';
        ctx.fillText(u.messagesCount.toString(), 475, 100 * i + 45);
    });

    // Adding profile pictures background, in case of loading error
    ctx.fillStyle = 'black';
    formattedUsers.forEach((u, i) => {
        ctx.beginPath();
        ctx.arc(50, 100 * i + 50, 28, 0, 7.853981633974483);
        ctx.fill();
    });

    // const addAvatars = formattedUsers.map((u, i) => new Promise((resolve, reject) => {
    //     const img = new Image();
    //     img.onload = () => {
    //         // Save the context
    //         ctx.save();
    //         // Add clipping
    //         ctx.beginPath();
    //         ctx.arc(50, 100 * i + 50, 30, 0, 7.853981633974483);
    //         ctx.clip();
    //         // Draw image
    //         ctx.drawImage(img, 20, 100 * i + 20, 60, 60);
    //         // Restore the context
    //         ctx.restore();
    //         // Mark as done
    //         resolve();
    //     };
    //     img.onerror = reject;
    //     img.src = u.avatarURL;
    // }));

    const addAvatars = formattedUsers.map((u, i) =>
        placeSquareImage(u.avatarURL, ctx, 20, 100 * i + 20, 60, true));

    await Promise.all(addAvatars);

    return await writePng(canvas);

}
