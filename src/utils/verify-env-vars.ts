export default function verifyEnvVars() {

    if (!process.env.NODE_ENV)
        console.warn('Warning: recommended env var NODE_ENV is not specified.');

    if (!process.env.BOT_KEY)
        throw new Error('Env variable BOT_KEY is missing, but required to decrypt bots API keys.');

    if (!process.env.DB_URI)
        throw new Error('Env variable DB_URI is missing, but required to access the database.');

    if (!process.env.WEB_BASE_URL)
        throw new Error('Env variable WEB_BASE_URL is missing, but required to give access to the web control panel.');

}
