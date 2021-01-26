import path from 'path';
import { Request, Response } from 'express';


export function sendError(req: Request, res: Response, errorMsg: string, code = 400) {
    if (req.path.startsWith(`${process.env.WEB_ROOT_PATH}/api`))
        res.status(code).json({ error: errorMsg });
    else
        res.status(code).render(
            path.join(__dirname, 'error.ejs'),
            { errorMsg },
        );
}
