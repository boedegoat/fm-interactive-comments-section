const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      white: 'hsl(0, 0%, 100%)',
      blue: {
        moderate: 'hsl(238, 40%, 52%)',
        'light-grayish': 'hsl(239, 57%, 85%)',
        'dark-grayish': 'hsl(211, 10%, 45%)',
        dark: 'hsl(212, 24%, 26%)',
      },
      red: {
        soft: 'hsl(358, 79%, 66%)',
        pale: 'hsl(357, 100%, 86%)',
      },
      gray: {
        200: 'hsl(223, 19%, 93%)',
        100: 'hsl(228, 33%, 97%)',
      },
    },
    fontFamily: {
      sans: ['Rubik', ...defaultTheme.fontFamily.sans],
    },
    extend: {},
  },
  plugins: [],
}
