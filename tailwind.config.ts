import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0A0A0F',
          50: '#F2F2F5',
          100: '#E0E0E8',
          200: '#C2C2D0',
          300: '#9090A8',
          400: '#606078',
          500: '#40405A',
          600: '#2A2A40',
          700: '#1A1A28',
          800: '#111120',
          900: '#0A0A0F',
        },
        accent: {
          DEFAULT: '#6C63FF',
          light: '#A59DFF',
          dark: '#4A42CC',
          glow: 'rgba(108, 99, 255, 0.3)',
        },
        emerald: {
          flow: '#10B981',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        amber: {
          flow: '#F59E0B',
        },
        rose: {
          flow: '#F43F5E',
        },
      },
      backgroundImage: {
        'grid-pattern': `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v1H0zM0 0v40h1V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'noise': `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 20px rgba(108,99,255,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(108,99,255,0.6)' } },
      },
      boxShadow: {
        'glow-accent': '0 0 30px rgba(108, 99, 255, 0.3)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.25)',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.08) inset',
      },
    },
  },
  plugins: [],
}
export default config
