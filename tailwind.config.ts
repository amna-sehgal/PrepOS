import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        archivo: ['var(--font-archivo)', 'sans-serif'],
        familjen: ['var(--font-familjen)', 'sans-serif'],
        mono: ['Fragment Mono', 'monospace'],
      },
      colors: {
        void: '#1A1035',
        indigo: {
          DEFAULT: '#534AB7',
          light: '#7F77DD',
          dark: '#3C3489',
          deeper: '#26215C',
        },
        lavender: '#AFA9EC',
        mist: '#EEEDFE',
        ghost: '#F7F6FD',
        prep: {
          teal: '#1D9E75',
          amber: '#EF9F27',
          coral: '#E24B4A',
        }
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-in-right': 'slideInRight 0.5s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseRing: {
          '0%, 100%': { outlineColor: '#AFA9EC' },
          '50%': { outlineColor: '#534AB7' },
        },
      },
    },
  },
  plugins: [],
}

export default config