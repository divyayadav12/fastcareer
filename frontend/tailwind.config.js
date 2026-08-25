/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B4C72', // FAST CAREERS Logo Blue
          hover: '#083C5A',
        },
        secondary: {
          DEFAULT: '#1F2937', // Dark Navy / Charcoal
          hover: '#111827',
        },
        accent: {
          light: '#EAF3F9',
          gradientStart: '#126191',
          gradientEnd: '#0B4C72',
        },
        background: {
          DEFAULT: '#FFFFFF',
          light: '#F9FAFB',
        },
        text: {
          DEFAULT: '#1F2937', // Dark Charcoal
          light: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Assuming Inter for modern SaaS look
      },
      spacing: {
        '8px': '0.5rem',
        // 8px system is largely covered by default tailwind spacing (1 = 0.25rem = 4px, 2 = 8px, 4 = 16px, etc.)
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      }
    },
  },
  plugins: [],
}
