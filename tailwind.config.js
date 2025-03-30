/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6',
        'secondary': '#10b981',
        'accent': '#8b5cf6',
        'glass': 'rgba(255, 255, 255, 0.4)',
        'glass-dark': 'rgba(15, 23, 42, 0.75)',
      },
      backdropBlur: {
        'xs': '2px',
        'lg': '16px',
        'xl': '24px',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.65)',
        'glass-dark': 'rgba(15, 23, 42, 0.75)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.20)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.3)',
      },
    },
  },
  plugins: [],
}

