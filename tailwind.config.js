/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#7b1e2b",
          deep: "#5c1420",
          ink: "#47101a",
        },
        gold: {
          DEFAULT: "#c9a24b",
          bright: "#e0b45f",
          pale: "#f7e2a8",
          dark: "#8a6a1f",
        },
        marigold: {
          DEFAULT: "#e8821e",
          soft: "#f2a14b",
        },
        cream: {
          DEFAULT: "#faf1dd",
          deep: "#f4e7c7",
          card: "#fffaf0",
        },
        ink: {
          DEFAULT: "#53301f",
          soft: "#8a6a52",
        },
        sindoor: "#c8102e",
        haldi: "#f2b705",
        mehendi: "#3f6212",
        peacock: "#0e5c61",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        script: ["'Great Vibes'", "'Brush Script MT'", "cursive"],
        body: ["'Nunito Sans'", "'Segoe UI'", "system-ui", "sans-serif"],
        deva: ["'Yatra One'", "'Tiro Devanagari Hindi'", "serif"],
        devaText: ["'Tiro Devanagari Hindi'", "serif"],
      },
      animation: {
        'fade-in': 'fadeIn 2s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'flicker': 'flicker 1.4s ease-in-out infinite',
        'spin-slow': 'spin 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        flicker: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)', opacity: '1' },
          '30%': { transform: 'scaleY(1.12) scaleX(.94)', opacity: '.92' },
          '60%': { transform: 'scaleY(.94) scaleX(1.05)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
