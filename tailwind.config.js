/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,vue}"
  ],
  theme: {
    extend: {
      fontFamily: {
        "Rubik": ["Rubik", "sans-serif"],
      }
    }
  },
  plugins: [],
};
