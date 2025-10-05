/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  darkMode: 'class', // Added from components for consistency
  theme: {
    extend: {
      colors: {
        // Your original color palette
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
        },
        // Colors from admin-products component
        'admin-primary': '#17cf17', // Renamed to avoid conflict with your primary
        'background-light': '#f6f8f6',
        'background-dark': '#112111',
        'content-light': '#112111',
        'content-dark': '#f6f8f6',
        'subtle-light': '#e3e8e3',
        'subtle-dark': '#2a3c2a',
        // Colors from ventas component
        'ventas-primary': '#17cf17', // Renamed to avoid conflict
        'foreground-light': '#1f2937',
        'foreground-dark': '#e5e7eb',
        'card-light': '#ffffff',
        'card-dark': '#1a2e1a',
        'border-light': '#e5e7eb',
        'border-dark': '#374151',
      },
      fontFamily: {
        // Your original fonts
        sans: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        // Fonts from components
        display: ['Epilogue', 'Manrope', 'sans-serif'], // Combined Epilogue (admin-products) and Manrope (ventas)
      },
      spacing: {
        // Your original spacing
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        // Your original borderRadius
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        // Component borderRadius (merged, using smallest values to avoid conflicts)
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
      },
      boxShadow: {
        // Your original boxShadow
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'hard': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        // Your original animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'gentle-sway': 'gentleSway 6s ease-in-out infinite',
        'grow': 'grow 0.3s ease-in-out',
      },
      keyframes: {
        // Your original keyframes
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
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}