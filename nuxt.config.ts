// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  
  // Importing modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@nuxtjs/google-fonts'
  ],
  
  // Google Fonts configuration
  googleFonts: {
    families: {
      'Montserrat': [400, 500, 600, 700],
      'Poppins': [300, 400, 500],
      'Playfair Display': [400, 700]
    },
    display: 'swap'
  },
  
  // App configuration with meta tags
  app: {
    head: {
      title: 'Vivero Emma - Plantas y Jardinería',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Vivero Emma - El mejor vivero de Cuartel V, Moreno, Buenos Aires. Plantas, flores, árboles y todo para tu jardín.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Tailwind CSS configuration
  tailwindcss: {
    config: {
      content: [
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue'
      ]
    }
  },
  
  // Color mode configuration
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },
  
  // Runtime config for API URLs
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://viveroemma-production.up.railway.app/api'
    }
  },
  
  // Custom CSS
  css: ['~/assets/css/main.css']
})