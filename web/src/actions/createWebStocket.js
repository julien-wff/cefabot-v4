export const createWebSocket = BASE_ROOT => {
    let protocol = 'ws:';
    if (window.location.protocol === 'https:')
        protocol = 'wss:';
    return new WebSocket(`${protocol}//${window.location.host}${BASE_ROOT}/ws/`);
};
