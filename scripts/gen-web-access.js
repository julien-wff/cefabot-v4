const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const { userInfo } = require('os');
const kleur = require('kleur');

const args = process.argv.slice(2).join(' ');
const permanentSessionName = (/--permanent[ =]([\w-]{4,32})/.exec(args) || [])[1];
console.log(permanentSessionName);


const WebPanelAccessSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: () => new Date(),
    },
    token: {
        type: String,
        required: true,
    },
    connected: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true,
    },
    permanent: {
        type: Boolean,
        default: false,
    },
    sessionName: String,
    ip: String,
});

const WebPanelAccess = mongoose.model('WebPanelAccess', WebPanelAccessSchema);


(async () => {

    console.log(kleur.italic('Connecting to the DB...'));

    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log(kleur.green(kleur.green('Connection successful. Creating access...')));

    const token = uuid();

    const access = new WebPanelAccess({
        userId: 'console',
        userName: userInfo().username,
        token,
        permanent: !!permanentSessionName,
        ...(permanentSessionName ? { sessionName: permanentSessionName } : {}),
    });

    await access.save();

    console.log(
        kleur.green('Access created. You can access to the panel through the following link once the bot is started:\n') +
        kleur.cyan(kleur.underline(`${process.env.WEB_BASE_URL}/${permanentSessionName ? 'permanent' : 'connect'}?token=${token}`))
    );

    await mongoose.disconnect();

})()
    .catch(err => console.error(kleur.red(err)))
    .finally(() => process.exit(0));
