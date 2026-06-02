/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          deep: 'var(--sq-forest-deep)',
          primary: 'var(--sq-forest-primary)',
        },
        sage: {
          medium: 'var(--sq-sage-medium)',
          light: 'var(--sq-sage-light)',
        },
        mint: {
          soft: 'var(--sq-mint-soft)',
          pale: 'var(--sq-mint-pale)',
        },
        cream: {
          green: 'var(--sq-cream-green)',
        },
        wc: {
          gold: 'var(--sq-wc-gold)',
          'gold-bright': 'var(--sq-wc-gold-bright)',
          'blue-deep': 'var(--sq-wc-blue-deep)',
          'blue-mid': 'var(--sq-wc-blue-mid)',
          'blue-bright': 'var(--sq-wc-blue-bright)',
        },
        neutral: {
          charcoal: 'var(--sq-charcoal)',
          'dark-gray': 'var(--sq-dark-gray)',
          'medium-gray': 'var(--sq-medium-gray)',
          'light-gray': 'var(--sq-light-gray)',
          'off-white': 'var(--sq-off-white)',
        },
      },
      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        sq: 'var(--sq-shadow-md)',
        'sq-lg': 'var(--sq-shadow-lg)',
        'sq-xl': 'var(--sq-shadow-xl)',
        gold: 'var(--sq-shadow-gold)',
      },
      backgroundImage: {
        'gradient-gold': 'var(--sq-gradient-gold)',
        'gradient-pitchnight': 'var(--sq-gradient-pitchnight)',
      },
      borderRadius: {
        sq: 'var(--sq-radius-md)',
        'sq-lg': 'var(--sq-radius-lg)',
        'sq-xl': 'var(--sq-radius-xl)',
      },
    },
  },
  plugins: [],
};
