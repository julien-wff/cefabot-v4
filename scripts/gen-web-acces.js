require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const { userInfo } = require('os');

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

    console.log('Connecting to the DB...');

    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('Connection successful. Creating access...');

    const token = uuid();

    const access = new WebPanelAccess({
        userId: 'console',
        userName: userInfo().username,
        token,
    });

    await access.save();

    console.log(`Access created. You can access to the panel through the following link once the bot started.
${process.env.WEB_BASE_URL}:${process.env.WEB_PORT}/connect?token=${token}`);

})()
    .catch(console.error)
    .finally(() => process.exit(0));

