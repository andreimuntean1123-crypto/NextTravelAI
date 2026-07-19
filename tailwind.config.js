/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Albastru închis (deep navy)
        navy: {
          50: '#eef2f7',
          100: '#d5deeb',
          200: '#adbdd6',
          300: '#7d94ba',
          400: '#4f6a99',
          500: '#334f7d',
          600: '#243a5e',
          700: '#1b2c48',
          800: '#132038',
          900: '#0c1628',
          950: '#070d18',
        },
        // Turcoaz
        turquoise: {
          50: '#effefb',
          100: '#c8fff4',
          200: '#91feea',
          300: '#52f5dc',
          400: '#1fe0c8',
          500: '#06c3ae',
          600: '#019d8f',
          700: '#067d73',
          800: '#0a635d',
          900: '#0d524d',
          950: '#00302f',
        },
        // Bej deschis (light sand)
        sand: {
          50: '#fdfbf7',
          100: '#f8f2e7',
          200: '#f1e6d0',
          300: '#e6d3af',
          400: '#d8bb86',
          500: '#cca466',
        },
        // Accente aurii
        gold: {
          400: '#e6c374',
          500: '#d4a94a',
          600: '#b98d34',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(12, 22, 40, 0.18)',
        'soft-lg': '0 24px 60px -18px rgba(12, 22, 40, 0.28)',
        glow: '0 0 0 1px rgba(31, 224, 200, 0.25), 0 12px 40px -12px rgba(6, 195, 174, 0.45)',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '2rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-fast': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out both',
        'fade-in-fast': 'fade-in-fast 0.4s ease-out both',
        'slide-up': 'slide-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 0.35s ease-out both',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
