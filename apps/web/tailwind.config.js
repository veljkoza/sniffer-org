const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      colors: {
        developerTools: {
          table: {
            background: '#202124',
            headerBg: '#292a2d',
            border: '#494c50',
            rowEvenBg: '#242424',
            rowOddBg: '#333333',
          },
        },
      },
    },
  },
  plugins: [],
};
