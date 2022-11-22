/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#343434',
        blue: '#00A0E2',
        gray: '#939393',
        border: '#DDD',
        footer: '#232B33',
        'pre-login-light-blue': '#D6E7F7',
      },
      fontFamily: {
        serif: ['Times New Roman', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
  important: true,
}
