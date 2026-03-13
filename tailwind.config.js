/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cta: '#AECC42',
        'cta-hover': '#9bb83a',
        'brand-green': '#AECC42',
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
