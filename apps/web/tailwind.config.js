const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

const palette = {
  // Grays
  charcoal: {
    100: '#494c50', // Lightest shade
    200: '#333333', // Lighter shade
    300: '#292a2d', // Light shade
    400: '#242424', // Medium shade
    500: '#202124', // Darkest shade
  },
  black: '#000000', // Pure black
};

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
            background: palette.charcoal[500],
            headerBg: palette.charcoal[300],
            border: palette.charcoal[100],
            rowEvenBg: palette.charcoal[400],
            rowOddBg: palette.charcoal[200],
            rowHover: palette.charcoal[200],
          },
          tabs: {
            headerBg: palette.charcoal[300],
            tabHoverBg: palette.charcoal[200],
            tabActiveBg: palette.black,
          },
        },
      },
    },
  },
  plugins: [],
};
