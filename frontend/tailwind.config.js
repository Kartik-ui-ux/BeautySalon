/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        background: '#FFFCF8',
        foreground: '#2D2D2D',
        primary: {
          DEFAULT: '#C5A065',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F2EBE5',
          foreground: '#4A4A4A',
        },
        muted: {
          DEFAULT: '#F5F5F0',
          foreground: '#787878',
        },
        accent: {
          DEFAULT: '#9CAF88',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.6)',
          foreground: '#2D2D2D',
        },
        border: '#E6DCD2',
        input: '#E6DCD2',
        ring: '#C5A065',
      },
      borderRadius: {
        sm: '0.125rem',
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0,0,0,0.05)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}