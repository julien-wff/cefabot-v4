import { Request, Response } from 'express';
import getAvailableCommands from '../../../commands/command/get-available-commands';

export default async function commands(_: Request, res: Response) {

    const commands = getAvailableCommands();

    res.json(
        commands.map(c => ({ name: c.name, description: c.description, removable: c.removable })),
    );

}
