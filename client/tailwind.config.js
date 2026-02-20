/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gun: {
          950: "#090b0e",
          900: "#0f1318",
          800: "#161c25",
          750: "#1c2330",
          700: "#242e3d",
          600: "#2e3c4f",
          500: "#3d5069",
          400: "#5d728f",
          300: "#7a90a8",
          200: "#9fb2c4",
          100: "#d0dce8",
          50: "#edf3f8",
        },
        brass: {
          DEFAULT: "#c8922a",
          light: "#dba93c",
          muted: "#8c6420",
          dark: "#7a5418",
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        body: ["Barlow", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
