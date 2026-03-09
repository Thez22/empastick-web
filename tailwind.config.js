/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cta: '#0b5b33',
        'cta-hover': '#064226',
        'brand-green': '#7a9e2d',
        'dark-green': '#064e3b',
        'accent-orange': '#EB5E4E',
        'text-muted': '#5c6370',
        'border-soft': '#e5e4e0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
