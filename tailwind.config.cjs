const defaultTheme = require('tailwindcss/defaultTheme');
let colors = require('tailwindcss/colors');
delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];
colors = { ...colors, ...{ transparent: 'transparent' } };

module.exports = {
  mode: 'jit',
  media: false,
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
        serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        ...colors,
        forrest: {
          DEFAULT: '#506967',
          900: '#31464B',
        },
        cream: {
          200: '#EEE8D4',
          DEFAULT: '#D9CEB5',
          900: '#C7B79F',
        },
        smoke: {
          DEFAULT: '#e9e9e9',
          900: '#444444',
        },
        offwhite: {
          DEFAULT: '#fcfaff',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
