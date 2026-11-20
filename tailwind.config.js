/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#090B14',
        slateIndigo: '#111424',
        terrain: '#153B50',
        activeBlue: '#2185B5',
        cyanGlow: '#5CE1E6',
        cyanSoft: '#A5F3FC',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      boxShadow: {
        neon: '0 0 24px rgba(92, 225, 230, 0.18)',
        danger: '0 0 24px rgba(239, 68, 68, 0.2)',
      },
      borderColor: {
        glass: 'rgba(92, 225, 230, 0.25)',
      },
      backdropBlur: {
        glass: '16px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
