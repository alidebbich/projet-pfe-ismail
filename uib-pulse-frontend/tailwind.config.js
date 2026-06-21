/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // UIB Brand
        'uib-red': '#E2001A',
        'uib-red-dim': 'rgba(226, 0, 26, 0.15)',
        'uib-red-glow': 'rgba(226, 0, 26, 0.35)',

        // Dark palette
        'noir-950': '#0A0A0A',
        'noir-900': '#111111',
        'noir-800': '#1A1A1A',
        'noir-700': '#222222',
        'noir-600': '#2A2A2A',

        // Glass / borders
        'glass-border': 'rgba(255, 255, 255, 0.08)',
        'glass-bg': 'rgba(255, 255, 255, 0.03)',

        // Status colors
        'status-green': '#22C55E',
        'status-orange': '#F59E0B',
        'status-red': '#E2001A',

        // Text
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        'text-muted': '#606060',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      boxShadow: {
        'glass': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'red-glow': '0 0 20px rgba(226, 0, 26, 0.4), 0 0 60px rgba(226, 0, 26, 0.15)',
        'red-glow-sm': '0 0 10px rgba(226, 0, 26, 0.3)',
        'green-glow': '0 0 20px rgba(34, 197, 94, 0.25)',
        'orange-glow': '0 0 20px rgba(245, 158, 11, 0.25)',
      },

      backdropBlur: {
        'glass': '20px',
      },

      backgroundImage: {
        'gradient-noir': 'linear-gradient(135deg, #0A0A0A 0%, #111111 50%, #0D0D0D 100%)',
        'gradient-red': 'linear-gradient(135deg, rgba(226,0,26,0.2) 0%, rgba(226,0,26,0.05) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'radial-glow': 'radial-gradient(ellipse at center, rgba(226,0,26,0.1) 0%, transparent 70%)',
      },

      animation: {
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'data-stream': 'dataStream 1.5s ease-in-out infinite',
      },

      keyframes: {
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(226, 0, 26, 0.3), 0 0 30px rgba(226, 0, 26, 0.1)' },
          '50%': { boxShadow: '0 0 25px rgba(226, 0, 26, 0.6), 0 0 60px rgba(226, 0, 26, 0.25)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        dataStream: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '50%': { opacity: 1 },
          '100%': { opacity: 0, transform: 'translateY(10px)' },
        },
      },

      gridTemplateColumns: {
        'bento': 'repeat(12, 1fr)',
      },
    },
  },
  plugins: [],
}
