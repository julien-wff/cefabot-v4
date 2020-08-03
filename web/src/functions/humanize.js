const sizes = {
    1: 'B',
    1e3: 'KB',
    1e6: 'MB',
    1e9: 'GB'
};

export function fileSize(s) {
    for (const size of Object.keys(sizes)) {
        if (+size * 1e3 > s)
            return `${Math.round(s / +size * 1e2) / 1e2} ${sizes[size]}`;
    }
}
