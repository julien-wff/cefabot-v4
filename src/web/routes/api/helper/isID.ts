export function isMongooseID(id: any) {
    return !!(typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/));
}

export function isGuildID(id: any) {
    return !!(typeof id === 'string' && id.match(/\d{18}/));
}

export function isClientToken(token: any) {
    return !!(typeof token === 'string' && token.match(/^[M-Q][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}$/));
}

export function isClientID(id: any) {
    return !!(typeof id === 'string' && id.match(/^\d{17,18}$/));
}

export function isBotName(id: any) {
    return !!(typeof id === 'string' && id.match(/^[a-z-]{5,30}$/));
}
