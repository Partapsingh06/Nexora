/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexora: {
          blue: "#2874f0",
          darkBlue: "#1a5bbf",
          yellow: "#ffe500",
          amber: "#ff9f00",
          orange: "#fb641b",
          green: "#388e3c",
          grayBg: "#f1f2f4",
          border: "#e0e0e0",
          dark: "#212121",
          muted: "#878787",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 4px 0 rgba(0,0,0,.08)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,.12)',
      }
    },
  },
  plugins: [],
}
