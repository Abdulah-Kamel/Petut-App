/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary_app: {
          DEFAULT: "#FF8D4D",
          dark: "#5A282B",
        },
        secondary: {
          DEFAULT: "#FFB9A9",
          light: "#FFEFE9",
          dark: "#1E202D",
        },
        accent: {
          DEFAULT: "#FF5464",
        },
        neutral: {
          DEFAULT: "#5A282B",
        },
      },
      fontFamily: {
        exo: ["Exo", "Exo 2", "sans-serif"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};