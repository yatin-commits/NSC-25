/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Define "cabinet-grotesk" (use a kebab-case or similar key)
        'cabinet-grotesk': ['Cabinet Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};