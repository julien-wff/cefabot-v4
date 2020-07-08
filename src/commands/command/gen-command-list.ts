import { Command } from '../commands';

export default function genCommandList(commands: Command[], botCommands: Command[]): string {

    return commands
        .map(cmd =>
            `${
                botCommands.find(botCmd => botCmd.name === cmd.name)
                    ? ':green_circle:'
                    : ':red_circle:'
            } ${cmd.name}`,
        )
        .join('\n');

}
