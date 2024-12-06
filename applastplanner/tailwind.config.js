/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        spin: 'spin 1s linear infinite', // Agrega la animación de giro
      },
      keyframes: {
        spin: {
          to: {
            transform: 'rotate(360deg)', // Define la animación de rotación
          },
        },
      },
    },
  },
  plugins: [],
}
