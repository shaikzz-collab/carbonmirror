/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          darkBg: '#090d16',
          darkCard: 'rgba(15, 23, 42, 0.65)',
          lightBg: '#f8fafc',
          lightCard: 'rgba(255, 255, 255, 0.75)',
          emerald: '#10b981',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          indigo: '#6366f1',
          violet: '#8b5cf6',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-up': 'scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulse-slow': 'pulseSlow 3s infinite ease-in-out',
        'reveal-twin': 'revealTwin 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'drift-slow-1': 'drift1 25s infinite alternate ease-in-out',
        'drift-slow-2': 'drift2 30s infinite alternate ease-in-out',
        'drift-slow-3': 'drift3 22s infinite alternate ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        revealTwin: {
          '0%': { filter: 'brightness(0) blur(20px)', transform: 'scale(0.8)', opacity: '0' },
          '50%': { filter: 'brightness(1.5) blur(10px)', transform: 'scale(1.05)', opacity: '0.8' },
          '100%': { filter: 'brightness(1) blur(0)', transform: 'scale(1)', opacity: '1' },
        },
        drift1: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(40px, -60px) scale(1.15)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        drift2: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-50px, 70px) scale(1.2)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        drift3: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(-60px, -40px) scale(0.85)' },
          '66%': { transform: 'translate(50px, 50px) scale(1.15)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
