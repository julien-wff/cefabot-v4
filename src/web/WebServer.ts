import express, { Express, NextFunction, Request, Response } from 'express';
import ms from 'ms';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import WebPanelAccess from '../models/WebPanelAccess';
import { sendError } from './helpers/sendError';
import { connectionRouter, apiRouter } from './router';
import compression from 'compression';
import http from 'http';
import https from 'https';
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
        const server = this.createServer();
        this.app.set('etag', false);
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.resolve(__dirname, 'views'));
        // Setup socket
        this.ws = new ws.Server({ server, path: `${process.env.WEB_ROOT_PATH}/ws/` });
        this.ws.on('connection', this.handleWSConnection);
        // Middlewares and routes
        this.app.use(compression());
        this.app.use(cookieParser());
        this.app.use(this.hidePoweredBy);
        this.app.use(`${process.env.WEB_ROOT_PATH}/`, connectionRouter);
        this.app.use(fileUpload({ createParentPath: true }));
        this.app.get(`${process.env.WEB_ROOT_PATH}/favicons/site.webmanifest`, (_, res) => res.sendFile(path.resolve(WEB_DIR, 'favicons/site.webmanifest')));
        this.checkAuth = this.checkAuth.bind(this);
        this.app.use(this.checkAuth);
        this.app.use(process.env.WEB_ROOT_PATH || '/', express.static(WEB_DIR, { etag: false }));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(`${process.env.WEB_ROOT_PATH}/api`, apiRouter);
        this.app.get([ `${process.env.WEB_ROOT_PATH}/app`, `${process.env.WEB_ROOT_PATH}/app/*` ], (_, res) => {
            res.render(path.join(WEB_DIR, 'index.ejs'), {
                WEB_ROOT_PATH: process.env.WEB_ROOT_PATH,
                TOKEN_EXPIRE_DURATION,
            });
        });

        this.app.use(((req, res) => {
            sendError(req, res, 'Page not found', 404);
        }));

        const listener = server.listen(process.env.WEB_PORT);
        listener.setTimeout(15000);
    }


    hidePoweredBy(req: Request, res: Response, next: NextFunction) {
        res.removeHeader('X-Powered-By');
        next();
    }


    createServer(): http.Server | https.Server {
        const keyPath = path.resolve(process.env.CERT_PATH || '.', 'privkey.pem');
        const certPath = path.resolve(process.env.CERT_PATH || '.', 'fullchain.pem');

        if (process.env.CERT_PATH && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
            const key = fs.readFileSync(keyPath, 'utf8');
            const cert = fs.readFileSync(certPath, 'utf8');
            return https.createServer({ key, cert }, this.app);
        } else {
            return http.createServer(this.app);
        }
    }


    async checkAuth(req: Request, res: Response, next: NextFunction) {

        const token = req.cookies?.token as string | undefined;
        if (!token) {
            sendError(req, res, 'Token missing', 401);
            return;
        }

        const auth = await WebPanelAccess.findOne({ token });
        if (!auth) {
            sendError(req, res, 'Authorisation not found', 401);
            return;
        }

        if ((!auth.permanent && auth.created.getTime() + TOKEN_EXPIRE_DURATION < Date.now()) || !auth.active) {
            sendError(req, res, 'Token expired', 401);
            return;
        }

        if (!auth.permanent && auth.ip !== req.ip) {
            sendError(req, res, 'Mismatching ip', 401);
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
