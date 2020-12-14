import { Image, CanvasRenderingContext2D, loadImage } from 'canvas';
import path from 'path';

const placeSquareImage = (imgUrl: string | undefined, ctx: CanvasRenderingContext2D, dx: number, dy: number, size: number, roundBorder = false) =>
    new Promise<void>((resolve, reject) => {

        if (imgUrl) {
            const img = new Image();
            img.onload = () => drawImage(img);
            img.onerror = reject;
            img.src = imgUrl;
        } else {
            loadImage(path.resolve('./res/discord-default-profile.png'))
                .then(drawImage)
                .catch(reject);
        }


        function drawImage(image: Image) {
            // Save the context
            ctx.save();
            // Add clipping
            ctx.beginPath();
            ctx.arc(dx + size / 2, dy + size / 2, size / 2, 0, 7.853981633974483);
            ctx.clip();

            // Draw image
            ctx.drawImage(image, dx, dy, size, size);

            if (roundBorder) // Restore the context
                ctx.restore();

            // Mark as done
            resolve();
        }

    });


export default placeSquareImage;
