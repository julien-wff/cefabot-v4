export function sanitize(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

export function sanitizeJSON(data) {
    const text = sanitize(JSON.stringify(data, null, 2));
    return `<pre><code>${text}</code></pre>`;
}
