/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#d0bcff',
        'primary-container': '#a078ff',
        'on-primary': '#3c0091',
        'on-primary-container': '#340080',
        'primary-fixed': '#e9ddff',
        'primary-fixed-dim': '#d0bcff',
        secondary: '#7bd0ff',
        'secondary-container': '#00a6e0',
        tertiary: '#cebdff',
        'tertiary-container': '#9b7fed',
        surface: '#090d16',
        'surface-container': '#121829',
        'surface-container-low': '#0d1322',
        'surface-container-lowest': '#060a12',
        'surface-container-high': '#252a37',
        'surface-container-highest': '#303542',
        'surface-variant': '#303542',
        'surface-bright': '#343946',
        'on-surface': '#dee2f3',
        'on-surface-variant': '#949db7',
        outline: '#4c556b',
        'outline-variant': '#494454'
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
}
