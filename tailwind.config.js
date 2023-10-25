/** @type {import('tailwindcss').Config} */module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/components/*.{js,jsx,ts,tsx}",
    "./src/screens/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      //#6C6024 //#DAC9A6
      colors: {
        'primary': '#00bcd4',
        'accent': '#ff9626',
        'auxiliary': '#eceff1',
        'shiro': '#f9fcff',
        'dark': '#1C1C1C',
      },
    },
  },
  plugins: [],
};
