/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightblue: "#D1DFE0",
        lightorange: "#F9E6E1",
        strongblue: "#7BB5B9",
        black: "rgba(49, 52, 52, 1)",
      },
      backgroundImage: {
        "gradient-bg": "linear-gradient(to bottom,#ffffffFFF)",
      },
      extend: {
        fontFamily: {
          sans: ["Outfit", "sans-serif"],
        },
      },
    },
    plugins: [],
  },
};
