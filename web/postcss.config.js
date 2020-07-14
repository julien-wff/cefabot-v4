const tailwindcss = require('tailwindcss');

module.exports = {
    plugins: [
        tailwindcss('./tailwind.config.js'),
        require('postcss-easy-import'),
        require('autoprefixer'),
        ...(process.env.NODE_ENV === 'production' ? [require('cssnano')] : [])
    ],
};
