import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#10B981',
          700: '#047857',
          900: '#064E3B',
        },
        neutral: {
          0: '#FFFFFF',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          900: '#111827',
        },
        error: {
          100: '#FEE2E2',
          600: '#DC2626',
        },
        warning: {
          500: '#F59E0B',
        },
        success: {
          600: '#16A34A',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;