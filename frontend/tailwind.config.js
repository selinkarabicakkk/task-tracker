/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        secondary: "#64748b",
        accent: "#3b82f6",
        background: "#f8fafc",
        card: "#ffffff",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
