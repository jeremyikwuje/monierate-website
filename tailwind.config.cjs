/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')


module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        // kanit: ["Kanit", "sans-serif"],
        // maitree: ["Maitree", "serif"],
        bitter: ["Bitter", "serif"],
        worksans: ["Work Sans", "sans-serif"],
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
      'yellow': colors.yellow,
      'indigo': colors.indigo,
      'pink': colors.pink,
      'green': colors.green,
      'red': colors.red,
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#59FABF",       
          "secondary": "#F000B8",   
          "neutral": "#3D4451",     
          "base-100": "#FFFFFF",     
          "info": "#3ABFF8",     
          "success": "#36D399",     
          "warning": "#FBBD23",     
          "error": "#F87272",
          "dark": "#00100A",
        },
      },
    ],
  },
  plugins: [require("daisyui"), require('flowbite-typography'),],
}
