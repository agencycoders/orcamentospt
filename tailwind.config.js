/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Custom colors can be added here
      },
      spacing: {
        // Custom spacing can be added here
      },
      borderRadius: {
        // Custom border radius can be added here
      },
      boxShadow: {
        // Custom shadows can be added here
      },
      animation: {
        // Custom animations can be added here
      },
      keyframes: {
        // Custom keyframes can be added here
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
