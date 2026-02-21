/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' }, // Zooms in slightly
        },
      },
      animation: {
        'heart-pulse': 'heartbeat 2s ease-in-out infinite', // Loops every 2 seconds
      },
    },
  },
  plugins: [],
};