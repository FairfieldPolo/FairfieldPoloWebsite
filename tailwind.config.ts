import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fairfield Polo Club brand palette
        polo: {
          green:      '#1a3a2a',   // deep field green — primary
          'green-mid':'#2d5a3d',   // mid green
          'green-light':'#4a8c5c', // light green accent
          gold:       '#c9a84c',   // polo gold — accent
          'gold-light':'#e8c97a',  // light gold
          cream:      '#f8f4ed',   // warm off-white bg
          'cream-dark':'#ede8df',  // slightly darker cream
          brown:      '#5c3d1e',   // leather / saddle
          white:      '#fdfcfa',   // warm white
          charcoal:   '#1c1c1c',   // near-black text
        },
      },
      fontFamily: {
        // Loaded via next/font in layout.tsx
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'grass-texture': "url('/images/grass-texture.jpg')",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease-out forwards',
        'fade-in':   'fadeIn 0.4s ease-out forwards',
        'slide-in':  'slideIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
