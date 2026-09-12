/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Indian Color Identity (PM-AJAY JeevanVaani)
        terracotta: {
          50: '#FDF6F0',
          100: '#F9ECE0',
          200: '#F3D5C0',
          300: '#EAB89A',
          400: '#DD906B',
          500: '#C84B31', /* Core Primary Saffron/Terracotta */
          600: '#B23B22',
          700: '#942D18',
          800: '#7B2515',
          900: '#652114',
        },
        forest: {
          50: '#F0F7F4',
          100: '#DBEDE3',
          200: '#B9DDC9',
          300: '#8DC5A8',
          400: '#5DA783',
          500: '#1B4D3E', /* Core Secondary Deep Green */
          600: '#144033',
          700: '#10342A',
          800: '#0C2A22',
          900: '#09211B',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#F8F4ED',
          300: '#F0E8DC',
          400: '#E4D8C5',
          500: '#D5C4AA',
        },
        gov: {
          navy: '#0A2540',
          blue: '#1E3A8A',
          marigold: '#F59E0B',
          saffron: '#C84B31',
          emerald: '#1B4D3E',
          slate: '#0F172A',
          cream: '#FDFBF7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1.0)' },
        }
      }
    },
  },
  plugins: [],
}
