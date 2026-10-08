/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
        'primary-container': 'rgba(var(--color-primary-rgb, 124, 92, 252), 0.85)',
        'on-primary': '#000000',
        'on-primary-container': '#ffffff',
        'primary-fixed': 'rgba(var(--color-primary-rgb, 124, 92, 252), 0.2)',
        'primary-fixed-dim': 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
        secondary: 'rgba(var(--color-accent-rgb, 56, 189, 248), <alpha-value>)',
        'secondary-container': 'rgba(var(--color-accent-rgb, 56, 189, 248), 0.85)',
        accent: 'rgba(var(--color-accent-rgb, 56, 189, 248), <alpha-value>)',
        violet: {
          50: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
          100: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
          200: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
          300: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
          400: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
          500: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
          600: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
          700: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
          800: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
          900: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)',
          950: 'rgba(var(--color-primary-rgb, 124, 92, 252), <alpha-value>)'
        },
        tertiary: '#cebdff',
        'tertiary-container': '#9b7fed',
        surface: 'rgba(var(--color-bg-rgb, 7, 11, 20), <alpha-value>)',
        'surface-container': 'rgba(var(--color-surface-container-rgb, 18, 24, 41), <alpha-value>)',
        'surface-container-low': 'rgba(var(--color-surface-low-rgb, 13, 19, 34), <alpha-value>)',
        'surface-container-lowest': 'rgba(var(--color-bg-rgb, 7, 11, 20), <alpha-value>)',
        'surface-container-high': 'rgba(var(--color-surface-high-rgb, 37, 42, 55), <alpha-value>)',
        'surface-container-highest':
          'rgba(var(--color-surface-variant-rgb, 48, 53, 66), <alpha-value>)',
        'surface-variant': 'rgba(var(--color-surface-variant-rgb, 48, 53, 66), <alpha-value>)',
        'surface-bright': 'rgba(var(--color-surface-high-rgb, 37, 42, 55), <alpha-value>)',
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
