import { Canvas } from 'canvas';
import { createWriteStream } from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const writePng = (canvas: Canvas) => new Promise<string>(resolve => {

    const outPath = path.resolve(__dirname, `../../../tmp/${uuid()}.png`);

    const out = createWriteStream(outPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => resolve(outPath));

});

export default writePng;
