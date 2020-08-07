export function shortpress(node, duration = 200) {
    let pressStart;

    const handleMousedown = e => {
        if (e.button !== 2)
            pressStart = Date.now();
    };

    const handleMouseup = () => {
        if (pressStart + duration > Date.now()) {
            node.dispatchEvent(
                new CustomEvent('shortpress')
            );
        }
    };

    node.addEventListener('mousedown', handleMousedown);
    node.addEventListener('mouseup', handleMouseup);

    return {
        update(newDuration) {
            duration = newDuration;
        },
        destroy() {
            node.removeEventListener('mousedown', handleMousedown);
            node.removeEventListener('mouseup', handleMouseup);
        }
    };
}
