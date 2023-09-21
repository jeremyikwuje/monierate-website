/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        bitter: ["Roboto", "serif"],
        worksans: ["Roboto", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#666',
            a: {
              color: '#06D68A',
              '&:hover': {
                color: '#048354',
              },
            },
          },
        },
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'black': colors.black,
      'white': colors.white,
      'gray': colors.gray,
      'blue': colors.blue,
      'indigo': colors.indigo,
      'yellow': colors.yellow,
      'green': colors.green,
      'red': colors.red,
      'light': '#EEFEF8',
      'lighter': '#EEFEF8',
      'dark': '#121212',
      'primary': '#06D68A'
    },
  },
  plugins: [require('flowbite-typography'),],
}
