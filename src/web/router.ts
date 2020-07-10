import { Router } from 'express';
import connectRoute from './routes/connect';
import disconnectRoute from './routes/disconnect';
import bots from './routes/api/bots';
import getBot from './routes/api/bots/get-bot';
import patchBot from './routes/api/bots/patch-bot';
import commands from './routes/api/commands';
import events from './routes/api/events';
import reboot from './routes/api/bots/reboot';
import getMultipleData from './routes/api/data/get-multiple-data';
import guild from './routes/api/bots/guild';
import postData from './routes/api/data/post-data';
import deleteData from './routes/api/data/delete-data';
import createBot from './routes/api/bots/create-bot';
import { getWebAccesses } from './routes/api/web-accesses/get-web-accesses';

const connectionRouter = Router();

connectionRouter.get('/connect', connectRoute);
connectionRouter.get('/disconnect', disconnectRoute);

const apiRouter = Router();

// Disable cache for route
apiRouter.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Bot
apiRouter.get('/bots', bots);
apiRouter.post('/bots', createBot);
apiRouter.get('/bots/:id', getBot);
apiRouter.patch('/bots/:id', patchBot);
apiRouter.get('/bots/:id/reboot', reboot);
// Guild
apiRouter.get('/bots/:id/guild/:guild', guild);
// Commands
apiRouter.get('/commands', commands);
// Events
apiRouter.get('/events', events);
// Data
apiRouter.get('/data', getMultipleData);
apiRouter.post('/data', postData);
apiRouter.delete('/data/:dataID', deleteData);
// Web accesses
apiRouter.get('/web-accesses', getWebAccesses);

export { connectionRouter, apiRouter };
