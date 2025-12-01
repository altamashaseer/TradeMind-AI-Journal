/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{components,context,pages,store,App,hooks}/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',  
  theme: {
    extend: {},
  },
  plugins: [],
}
