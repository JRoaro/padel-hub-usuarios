/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        DEFAULT: '#4A5568', // Your desired default color
      },
    },
  },
  plugins: [],
}