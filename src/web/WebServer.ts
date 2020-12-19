import express, { Express, NextFunction, Request, Response } from 'express';
import ms from 'ms';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import WebPanelAccess from '../models/WebPanelAccess';
import { connectionRouter, apiRouter } from './router';
import compression from 'compression';
import http from 'http';
import ws from 'ws';
import fileUpload from 'express-fileupload';


const TOKEN_EXPIRE_DURATION = ms('1h');
const WEB_DIR = path.resolve(__dirname, '../../web/public');

export default class WebServer {

    private readonly app: Express;
    private readonly ws: ws.Server;

    constructor() {
        // Setup server
        this.app = express();
        const server = http.createServer(this.app);
        this.app.set('etag', false);
        // Setup socket
        this.ws = new ws.Server({ server, path: '/ws/' });
        this.ws.on('connection', this.handleWSConnection);
        // Middlewares and routes
        this.app.use(compression());
        this.app.use(cookieParser());
        this.app.use(this.hidePoweredBy);
        this.app.use('/', connectionRouter);
        this.app.use(fileUpload({ createParentPath: true }));
        this.app.get('/favicons/site.webmanifest', (_, res) => res.sendFile(path.resolve(WEB_DIR, 'favicons/site.webmanifest')))
        this.checkAuth = this.checkAuth.bind(this);
        this.app.use(this.checkAuth);
        this.app.use(express.static(WEB_DIR, { etag: false }));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use('/api', apiRouter);
        this.app.get([ '/app', '/app/*' ], (_, res) => res.sendFile(path.join(WEB_DIR, 'index.html')));

        const listener = server.listen(process.env.WEB_PORT);
        listener.setTimeout(15000);
    }


    hidePoweredBy(req: Request, res: Response, next: NextFunction) {
        res.removeHeader('X-Powered-By');
        next();
    }


    async checkAuth(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies?.token as string | undefined;
        if (!token) {
            res.status(401).send('Token missing');
            return;
        }

        const auth = await WebPanelAccess.findOne({ token });
        if (!auth) {
            res.status(401).send('Authorisation not found');
            return;
        }

        if ((!auth.permanent && auth.created.getTime() + TOKEN_EXPIRE_DURATION < Date.now()) || !auth.active) {
            res.status(401).send('Token expired');
            return;
        }

        if (!auth.permanent && auth.ip !== req.ip) {
            res.status(401).send('Mismatching ip');
            return;
        }

        next();
    }


    handleWSConnection(socket: ws) {

        function onLog() {
            socket.send('new-log');
        }

        // @ts-ignore
        process.on('log', onLog);

        socket.once('close', () => {
            process.off('log', onLog);
        });
    }

}
