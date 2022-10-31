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
      },
    },
  },
  plugins: [],
  important: true,
}
