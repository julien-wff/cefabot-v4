export const intlOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
};

export const dateFormat =  new Intl.DateTimeFormat('FR', intlOptions);
