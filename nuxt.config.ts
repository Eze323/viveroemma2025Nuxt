// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // Importing modules
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/color-mode', '@vueuse/nuxt', 'nuxt-icon', '@nuxtjs/google-fonts', '@nuxt/image'],

  //image
  image: {
    dir: 'assets/images',
  },
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, // Favicon genérico
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }, // iOS
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }, // 16x16
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }, // 32x32
        { rel: 'manifest', href: '/site.webmanifest' } // Manifiesto web
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
      apiBaseUrl: process.env.API_BASE_URL,
      dbHost: process.env.DB_HOST || 'localhost',
      dbPort: process.env.DB_PORT || '3306',
      dbDatabase: process.env.DB_DATABASE || 'Vivero_Emma',
      dbUsername: process.env.DB_USERNAME || 'root',
      dbPassword: process.env.DB_PASSWORD || 'Ejemplo123!',
      dbBaseURL: process.env.DATABASE_URL
    }
  },

  components: [
    { path: '~/components', pathPrefix: false }, // Scans ~/components and subdirectories
  ],

  // Custom CSS
  css: ['~/assets/css/main.css'],
  plugins: [
    '~/plugins/auth.ts'
  ]
})