import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      black: '#050505',
      white: '#ffffff',
      neutral: {
        950: '#050505',
        900: '#0a0a0a',
        800: '#262626',
        700: '#404040',
        600: '#525252',
        500: '#737373',
        400: '#a3a3a3',
        300: '#d4d4d4',
        200: '#e5e5e5',
        100: '#f5f5f5',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'Arial', 'sans-serif'],
        japanese: ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
