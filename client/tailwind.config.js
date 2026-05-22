/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gun: {
          950: "#0a0c11",
          900: "#13161c",
          800: "#1f2229",
          750: "#2a2d35",
          700: "#3c4150",
          600: "#5b6170",
          500: "#8d94a3",
          400: "#aeb4c1",
          300: "#cdd1da",
          200: "#e2e5eb",
          100: "#eef0f4",
          50: "#f9fafc",
        },
        brass: {
          DEFAULT: "#d4a13a",
          light: "#ecbf5a",
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
