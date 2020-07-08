import { CommandPath, StaticCommandPathArg } from '../../../../commands/commands';

export default function getCommandPath(paths: CommandPath[], args: string[]): CommandPath | undefined {

    // Calculate the longest path length
    const maxPathLength = paths.reduce(
        (value, path) => value < path.args.length ? path.args.length : value,
        0,
    );

    // Filter the paths to find the good one
    let i = 0;
    while (paths.length > 1 && i < maxPathLength) {
        paths = paths.filter(path => {
                if (!path.args[i])
                    return false;
                if (path.args[i].argType === 'dynamic')
                    return true;
                return (path.args[i] as StaticCommandPathArg).triggers.includes(args[i]);
            },
        );
        i++;
    }

    const [ foundPath ] = paths;

    if (!foundPath)
        return;
    else
        return foundPath;

}
