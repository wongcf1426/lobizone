/** @type {import('tailwindcss').Config} */module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/components/*.{js,jsx,ts,tsx}",
    "./src/screens/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      //#6C6024 //#DAC9A6 //#00bcd4 //#00ded3
      colors: {
        'primary': '#b2d1cd',
        'accent': '#EED2CC',
        'focus': '#e8a2a2',
        'auxiliary': '#EAE6E5',
        'shiro': '#f9fcff',
        'dark': '#1C1C1C',
        'grey': '#d7dcdf',
      },
    }
  },
  plugins: [],
};
