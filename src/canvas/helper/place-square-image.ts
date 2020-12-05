import { Image, CanvasRenderingContext2D } from 'canvas';

const placeSquareImage = (imgUrl: string, ctx: CanvasRenderingContext2D, dx: number, dy: number, size: number, roundBorder = false): Promise<void> =>
    new Promise((resolve, reject) => {

        const img = new Image();
        img.onload = () => {
            if (roundBorder) {
                // Save the context
                ctx.save();
                // Add clipping
                ctx.beginPath();
                ctx.arc(dx + size / 2, dy + size / 2, size / 2, 0, 7.853981633974483);
                ctx.clip();
            }

            // Draw image
            ctx.drawImage(img, dx, dy, size, size);

            if (roundBorder) // Restore the context
                ctx.restore();

            // Mark as done
            resolve();
        };
        img.onerror = reject;
        img.src = imgUrl;

    });


export default placeSquareImage;
