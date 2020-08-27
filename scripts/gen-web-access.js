require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const { userInfo } = require('os');
const kleur = require('kleur');

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
    tempToken: String,
    active: {
        type: Boolean,
        default: true,
    },
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
    });

    await access.save();

    console.log(
        kleur.green('Access created. You can access to the panel through the following link once the bot is started:\n') +
        kleur.cyan(kleur.underline(`${process.env.WEB_BASE_URL}/connect?token=${token}`))
    );

})()
    .catch(err => console.error(kleur.red(err)))
    .finally(() => process.exit(0));
