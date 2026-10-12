// Condición para habilitar la documentación: activa en desarrollo o cuando ENABLE_DOCS='true'
const isDocsEnabled = process.env.NODE_ENV !== 'production' || process.env.ENABLE_DOCS === 'true'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // IMPORTANTE: Preset obligatorio para que funcione en Netlify Serverless
  nitro: {
    preset: 'netlify'
  },

  // Importing modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxt/content',
    ...(isDocsEnabled ? ['nuxt-openapi-docs-module'] : [])
  ],

  icon: {
    provider: 'server',
    localApiEndpoint: '/_nuxt_icon',
    fallbackToApi: true,
    serverBundle: {
      collections: ['heroicons', 'mdi'],
      externalizeIconsJson: false
    },
    clientBundle: {
      scan: true
    }
  },
  content: {
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

  // image
  image: {
    formats: ['webp', 'jpg'],
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'www.floreslosan.com',
      'www.hola.com',
      'acdn-us.mitiendanube.com',
      'dcdn-us.mitiendanube.com',
      'm.media-amazon.com',
      'cdn0.ecologiaverde.com',
      'habitanica.com',
      'http2.mlstatic.com',
      'cdn11.bigcommerce.com',
      'viverolasmargaritas.com.ar',
      'plumeriami.com',
      'upload.wikimedia.org',
      'viveroloscerezos.uy',
      'naturnoa.com',
      'catalogovallsgarden.com.ar',
      'www.provenwinners.com',
      'viverolosaromos.com',
      'viveroazahares.com.ar',
      'defeder.es',
      'static.bainet.es',
      'd22fxaf9t8d39k.cloudfront.net',
      'res.cloudinary.com',
      'www.lasaponaria.es',
      'content.elmueble.com'
    ],
  },

  // Google Fonts configuration
  googleFonts: {
    families: {
      'Montserrat': [400, 500, 600, 700],
      'Poppins': [300, 400, 500],
      'Playfair Display': [400, 700],
      'Material Symbols Outlined': true
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
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

  // Runtime config para Supabase y seguridad
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
    jwtSecret: process.env.JWT_SECRET,
    imgbbApiKey: process.env.IMGBB_API_KEY,

    public: {
      apiBaseUrl: process.env.API_BASE_URL || '',
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  css: ['~/assets/css/main.css'],
  plugins: [
    '~/plugins/auth.ts'
  ]
})