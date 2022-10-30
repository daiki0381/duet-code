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
        blue: '#00A0E2',
      },
    },
  },
  plugins: [],
  important: true,
}
