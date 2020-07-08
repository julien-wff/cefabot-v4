import { Command, PathRun } from './commands';
import { createCanvas } from 'canvas';
import writePng from '../canvas/helper/write-png';
import { unlinkSync } from 'fs';

const test: PathRun<Test> = async (message, _params, _bot) => {

    message.channel.startTyping();

    console.time('create canvas');
    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext('2d');

    // Linear gradient background
    const gradient = ctx.createRadialGradient(200, 200, 10, 200, 200, 190);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(.5, 'green');
    gradient.addColorStop(1, 'blue');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Write "Awesome!"
    ctx.font = '60px Impact';
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.rotate(0.1);
    ctx.fillText('Awesome!', 100, 200);

    // Draw line under text
    let text = ctx.measureText('Awesome!');
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.lineTo(100, 204);
    ctx.lineTo(100 + text.width, 204);
    ctx.stroke();
    console.timeEnd('create canvas');

    console.time('write png');
    const filePath = await writePng(canvas);
    console.timeEnd('write png');

    console.time('send image');
    await message.channel.send({
        files: [ {
            attachment: filePath,
        } ],
    });
    console.timeEnd('send image');

    console.time('delete image');
    unlinkSync(filePath);
    console.timeEnd('delete image');

    await message.channel.stopTyping();

};

interface Test {
}


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'test',
    description: 'Qui pour une partie de TESTS INTENSIFS ?',
    triggers: [
        'test',
        't',
    ],
    rootPath: {
        help: '',
        description: '',
        args: [],
        run: test,
    },
    removable: true,
};


export { properties };
