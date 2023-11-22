const { join } = require('path');
const prefixer = require('postcss-prefix-selector');

module.exports = {
  plugins: [
    require('tailwindcss')({
      config: join(__dirname, 'tailwind.config.js'),
    }),
    require('autoprefixer')(),
    prefixer({
      prefix: '#sniffer-content-root ',
      transform: function (prefix, selector, prefixedSelector) {
        if (selector.startsWith('.')) {
          return prefix + selector;
        }
        return selector;
      },
    }),
  ],
};
