import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-cbc', ENCRYPTION_KEY = process.env.BOT_KEY!, IV_LENGTH = 16;


export function encrypt(text: string) {

    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([ encrypted, cipher.final() ]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}


export function decrypt(text: string) {

    const textParts = text.split(':');
    // @ts-ignore
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([ decrypted, decipher.final() ]);

    return decrypted.toString();
}
