export const MESSAGE_XP: [ number, number, number ][] = [
    [ 30 * 1000, 60 * 1000, 1 ],                            // 30s - 1min
    [ 60 * 1000, 5 * 60 * 1000, 2 ],                        // 1min - 5min
    [ 5 * 60 * 1000, 15 * 60 * 1000, 3 ],                   // 5min - 15min
    [ 15 * 60 * 1000, 60 * 60 * 1000, 4 ],                  // 15min - 1h
    [ 60 * 60 * 1000, 12 * 60 * 60 * 1000, 5 ],             // 1h - 12h
    [ 12 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 8 ],        // 12h - 1d
    [ 24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000, 15 ],  // 1d - 30d
    [ 30 * 24 * 60 * 60 * 1000, Infinity, 25 ],             // More than 30d
];

export const ATTACHEMENT_XP = 10;

export const ONLINE_XP = 1;

export const VOICE_XP = 5;
