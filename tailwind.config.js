/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',    // Base white
        surface: '#F9FAFB',       // Card/off-white
        primary: '#1F2937',       // Text utama (dark gray)
        secondary: '#6B7280',     // Text muted
        accent: '#0D9488',        // Muted teal (satu accent only, calm)
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}