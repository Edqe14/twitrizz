/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.6, 0.01, 0, 0.95)',
      },
      colors: {
        'blue-bayoux': {
          DEFAULT: '#4A647B',
          50: '#AEBFCE',
          100: '#A1B5C7',
          200: '#88A1B7',
          300: '#6F8DA8',
          400: '#597994',
          500: '#4A647B',
          600: '#354858',
          700: '#202B35',
          800: '#0B0F12',
          900: '#000000',
        },
        'pattens-blue': {
          DEFAULT: '#DAF2FF',
          50: '#F1FAFF',
          100: '#EEF9FF',
          200: '#E9F7FF',
          300: '#E4F6FF',
          400: '#DFF4FF',
          500: '#DAF2FF',
          600: '#A7E0FF',
          700: '#74CEFF',
          800: '#41BCFF',
          900: '#0EAAFF',
        },
        'dodger-blue': {
          DEFAULT: '#4DA9FF',
          50: '#FFFFFF',
          100: '#F0F8FF',
          200: '#C7E4FF',
          300: '#9FD0FF',
          400: '#76BDFF',
          500: '#4DA9FF',
          600: '#158EFF',
          700: '#0072DC',
          800: '#0055A4',
          900: '#00386C',
        },
      },
    },
  },
  plugins: [],
};
