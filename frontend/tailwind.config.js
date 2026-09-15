/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0B1120',
        surface: '#131B2E',
        surfaceHover: '#1A2439',
        border: '#233047',
        signal: {
          DEFAULT: '#1E88D6',
          dim: '#15679F',
        },
        warn: '#F5A623',
        critical: '#FF6B6B',
        ink: {
          DEFAULT: '#E7ECF5',
          muted: '#8B93A7',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        signal: '0 0 0 1px rgba(30,136,214,0.3), 0 0 24px rgba(30,136,214,0.18)',
      },
    },
  },
  plugins: [],
};