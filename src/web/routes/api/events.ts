import { Request, Response } from 'express';
import getAvailableEvents from '../../../commands/event/get-available-events';

export default async function events(_: Request, res: Response) {

    const events = getAvailableEvents();

    res.json(
        events.map(e => ({ name: e.name, requiredDataKeys: e.requiredDataKeys })),
    );

}
