import { MomentInput } from '../schedule';
import ms from 'ms';

export default function convertMoment(moment: MomentInput): Date | undefined {

    if (typeof moment === 'string') {
        const momentString = ms(moment);
        if (!momentString)
            return;
        return new Date(
            Date.now() + momentString,
        );
    }

    if (typeof moment === 'number') {
        return new Date(
            Date.now() + moment,
        );
    }

    return moment;

}
