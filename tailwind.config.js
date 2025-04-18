/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        primary: "var(--font-primary)", // Montserrat
        secondary: "var(--font-secondary)", // Manrope
      },
    },
  },
  plugins: [],
};
