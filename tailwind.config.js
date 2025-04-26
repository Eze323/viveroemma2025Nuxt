/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D6A4F',
          light: '#40916C',
          dark: '#1B4332',
          50: '#E6F2ED',
          100: '#C1DFD2',
          200: '#9BCBB7',
          300: '#74B79B',
          400: '#4EA380',
          500: '#2D6A4F',
          600: '#276245',
          700: '#1B4332',
          800: '#10261E',
          900: '#05100A'
        },
        secondary: {
          DEFAULT: '#B08968',
          light: '#C9A989',
          dark: '#8C6A4C',
          50: '#F7F2ED',
          100: '#E9DFD4',
          200: '#D6C5B2',
          300: '#C9A989',
          400: '#B08968',
          500: '#8C6A4C',
          600: '#6E543C',
          700: '#4D3B2A',
          800: '#322719',
          900: '#19130C'
        },
        accent: {
          DEFAULT: '#FFB627',
          light: '#FFC95C',
          dark: '#E09400',
          50: '#FFF6E5',
          100: '#FFEAC2',
          200: '#FFD99F',
          300: '#FFC95C',
          400: '#FFB627',
          500: '#E09400',
          600: '#B77700',
          700: '#8F5D00',
          800: '#673B00',
          900: '#3F2600'
        },
        success: {
          DEFAULT: '#1E8A4A',
          light: '#25AC5C',
          dark: '#156839'
        },
        warning: {
          DEFAULT: '#F4A100',
          light: '#FFB627',
          dark: '#C68200'
        },
        error: {
          DEFAULT: '#D64143',
          light: '#E06566',
          dark: '#B13436'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'hard': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'gentle-sway': 'gentleSway 6s ease-in-out infinite',
        'grow': 'grow 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gentleSway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        grow: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}