/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eve: {
          cyan: '#ff1a1a',
          blue: '#cc0000',
          red: '#ff1a1a',
          green: '#39ff14',
          dark: '#0a0a0a',
        },
      },
    },
  },
  plugins: [],
}
