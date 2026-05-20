/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
    'bg-orange-500', 'bg-rose-500', 'bg-cyan-500',
    'bg-fuchsia-500', 'bg-teal-500', 'bg-surface-300',
    'bg-amber-50', 'text-amber-700', 'border-amber-200', 'bg-amber-400',
    'bg-blue-50',  'text-blue-700',  'border-blue-200',  'bg-blue-500',
    'bg-emerald-50','text-emerald-700','border-emerald-200','bg-emerald-500',
    'bg-gray-50',  'text-gray-600',  'border-gray-200',
    'bg-orange-50','text-orange-600','border-orange-200',
    'bg-red-50',   'text-red-600',   'border-red-200',
    'w-3.5', 'h-3.5', 'border',
    'w-4', 'h-4', 'border-2',
    'w-5', 'h-5', 'w-6', 'h-6',
    'w-7', 'h-7', 'w-8', 'h-8',
    'w-9', 'h-9', 'w-10', 'h-10', 'w-12', 'h-12',
    'text-[10px]', 'text-xs', 'text-sm', 'text-base', 'text-lg',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50)', 100: 'var(--brand-100)',
          200: 'var(--brand-200)', 300: 'var(--brand-300)',
          400: 'var(--brand-400)', 500: 'var(--brand-500)',
          600: 'var(--brand-600)', 700: 'var(--brand-700)',
          800: 'var(--brand-800)', 900: 'var(--brand-900)',
        },
        surface: {
          50: 'var(--surface-50)', 100: 'var(--surface-100)',
          150: 'var(--surface-150)', 200: 'var(--surface-200)',
          300: 'var(--surface-300)', 400: 'var(--surface-400)',
          500: 'var(--surface-500)', 600: 'var(--surface-600)',
          700: 'var(--surface-700)', 800: 'var(--surface-800)',
          900: 'var(--surface-900)',
        },
      },
      animation: {
        'fade-in':  'fade-in 0.2s ease-out forwards',
        'fade-up':  'fade-up 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
      boxShadow: { modal: 'var(--shadow-modal)' },
    },
  },
  plugins: [],
}