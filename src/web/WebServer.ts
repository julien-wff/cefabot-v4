import express, { Express, NextFunction, Request, Response } from 'express';
import ms from 'ms';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import WebPanelAccess from '../models/WebPanelAccess';
import { connectionRouter, apiRouter } from './router';

const TOKEN_EXPIRE_DURATION = ms('1h');
const WEB_DIR = path.resolve(__dirname, '../../web/public');

export default class WebServer {

    private readonly app: Express;

    constructor() {
        this.app = express();
        // Middlewares
        this.checkAuth = this.checkAuth.bind(this);
        this.app.use(express.static(WEB_DIR));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        // Routes
        this.app.use('/', connectionRouter);
        this.app.use(this.checkAuth);
        this.app.use('/api', apiRouter);
        this.app.get([ '/app', '/app/*' ], (_, res) => res.sendFile(path.join(WEB_DIR, 'index.html')));

        const server = this.app.listen(process.env.WEB_PORT);
        server.setTimeout(15000);
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

        if (auth.created.getTime() + TOKEN_EXPIRE_DURATION < Date.now() || !auth.active) {
            res.status(401).send('Token expired');
            return;
        }

        if (auth.ip !== req.ip) {
            res.status(401).send('Mismatching ip');
            return;
        }

        next();
    }

}
