const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    options: {
      safelist: [
        'bg-indigo-500', 
        'bg-green-500', 
        'bg-red-500', 
        'text-indigo-100',
        'text-red-100',
        'text-white',
      ],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      gray: colors.blueGray,
      black: colors.black,
      green: colors.green,
      blue: colors.blue,
      white: colors.white,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    },
    fontFamily: {
      'noto': ['Noto Sans KR', 'sans-serif']
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
