import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2.5rem', xl: '3rem' },
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0A0B',
          900: '#0A0A0B',
          850: '#0F0F11',
          800: '#131316',
          700: '#191A1D',
          600: '#212226',
          500: '#2A2B30',
        },
        line: {
          DEFAULT: 'rgba(242,239,233,0.10)',
          strong: 'rgba(242,239,233,0.18)',
          dark: 'rgba(10,10,11,0.12)',
        },
        ivory: {
          DEFAULT: '#F2EFE9',
          50: '#FAF8F5',
          100: '#F4F1EB',
          200: '#E7E3DA',
          300: '#CFCAC0',
          400: '#A9A49A',
          500: '#8A857C',
        },
        silver: '#C4C7CC',
        champagne: {
          DEFAULT: '#C2A473',
          light: '#D7BE92',
          dark: '#9C8153',
          faint: 'rgba(194,164,115,0.14)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        tighter: '-0.032em',
        tight: '-0.02em',
        wide: '0.02em',
        wider: '0.08em',
        widest: '0.18em',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      maxWidth: { '8xl': '1440px' },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'modal-in': {
          from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.985)' },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        'sheet-in': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'rise': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 160ms ease-out',
        'modal-in': 'modal-in 180ms cubic-bezier(0.22,0.61,0.36,1)',
        'sheet-in': 'sheet-in 220ms cubic-bezier(0.22,0.61,0.36,1)',
        'rise': 'rise 480ms cubic-bezier(0.22,0.61,0.36,1) both',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
