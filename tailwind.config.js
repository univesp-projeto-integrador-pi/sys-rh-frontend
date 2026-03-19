/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sugestão de cores para um visual moderno/jovem
        primary: "#3b82f6", 
        secondary: "#6366f1",
      }
    },
  },
  plugins: [],
}