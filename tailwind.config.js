// filepath: d:\Company\assignment_react\CloudExpress\pod-tshirt-app\tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Explicitly set your colors using hex or RGB
        primary: '#7e22ce', // Purple
        secondary: '#ec4899', // Pink
        accent: '#10b981', // Green
      },
    },
  },
  plugins: [],
};
