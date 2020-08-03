import { last } from './array';

/** @param path {string[]} */
export function mediaType(path) {

    const ext = last(last(path).split(/\./g));

    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext))
        return 'image';

    if (['mp4', 'mkv', 'avi', 'webm'].includes(ext))
        return 'video';

    if (['mp3', 'ogg', 'wav'].includes(ext))
        return 'audio';

    if (['txt'].includes(ext))
        return 'text';

    if (['json'].includes(ext))
        return 'json';

    return 'unknown';

}
