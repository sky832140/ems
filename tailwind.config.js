/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af",
        secondary: "#1d4ed8",
        accent: "#3b82f6",
      },
    },
  },
  plugins: [],
};
