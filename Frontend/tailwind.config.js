/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    colors:{
      gray: colors.neutral,
      coolGray: colors.gray,
      amber: colors.amber,
      emerald: colors.emerald,
      blue: colors.blue,
      dark:'#000000',
      white: '#FFFFFF',
      eksiContent: '#f5f5f5',
      eksiCodeLight: '#D6F9DD',
      eksiCode: '#82BD4E',
      eksiCodeMedium: '#7cb24c',
      eksiCodeDark: '#60695C',
      menu:' #ecf0f3',
      sText: '#666666',
      bg:'#c5d6d8',
      btnClr: '#2196f3'
    },
    fontFamily:{
      'eksifont': ['Montserrat','sans-serif'],
    },
    fontSize: {
      '2xs': '.65rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    backgroundSize: {
      'auto': 'auto',
      'cover': 'cover',
      'contain': 'contain',
      '90%': '90%',
      '50%': '50%',
      '16': '4rem',
    },
    screens: {
      
      'sm': {'min': '280px', 'max': '767px'},
      // => @media (min-width: 640px and max-width: 767px) { ... }

      'md': {'min': '768px', 'max': '1023px'},
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      'lg': {'min': '1024px', 'max': '1279px'},
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      'xl': {'min': '1280px', 'max': '1535px'},
      // => @media (min-width: 1280px and max-width: 1535px) { ... }

      '2xl': {'min': '1536px'},
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [
    require('tailwindcss-debug-screens'),
  ]
}
