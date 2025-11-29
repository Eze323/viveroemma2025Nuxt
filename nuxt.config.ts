// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  // Importing modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxt/content',
    'nuxt-openapi-docs-module'
  ],
  content: {

    database: {
      type: 'sqlite',
      filename: 'vivero_emma.sqlite',
    },
    watch: {
      port: 4000,
      showURL: true,
    }
  },
  openApiDocs: {
    folder: './docs',
    name: 'Vivero Emma API Documentation',
    files: function () { return { 'ApiVivero': 'Api Vivero' } }
  },


  //image
  image: {
    provider: 'netlify',
    formats: ['webp', 'jpg'],
    dir: 'assets/images',
    domains: ['images.pexels.com'],
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
    },
    // pageTransition: { name: 'layout', mode: 'out-in' },
    // layoutTransition: { name: 'layout', mode: 'out-in' }
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
    // Private keys are only available on the server
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbDatabase: process.env.DB_DATABASE,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbBaseURL: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET, // Added JWT Secret here for security

    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      // Only public variables here
    },
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