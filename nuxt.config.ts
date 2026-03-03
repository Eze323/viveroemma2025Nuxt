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
    'nuxt-openapi-docs-module',
    'nuxt-security',
    '@vite-pwa/nuxt'
  ],
  security: {
    headers: {
      crossOriginResourcePolicy: 'cross-origin',
      crossOriginOpenerPolicy: 'same-origin-allow-popups',
      crossOriginEmbedderPolicy: 'unsafe-none',
      contentSecurityPolicy: {
        'img-src': ["'self'", "data:", "https:", "http:", "*.pexels.com", "*.ibb.co", "*.unsplash.com"],
        'connect-src': ["'self'", "https:", "http:", "viveroemma-f75d9.firebaseapp.com", "*.googleapis.com", "*.gstatic.com"],
        'frame-src': ["'self'", "viveroemma-f75d9.firebaseapp.com", "*.firebaseapp.com", "*.google.com"],
        'script-src': ["'self'", "'unsafe-inline'", "https:", "*.googleapis.com", "*.gstatic.com", "*.google.com"],
        'style-src': ["'self'", "'unsafe-inline'", "https:", "fonts.googleapis.com"],
        'font-src': ["'self'", "https:", "fonts.gstatic.com"],
      },
      strictTransportSecurity: { maxAge: 31536000, preload: true }
    },
    rateLimiter: false,
  },
  routeRules: {
    "/productos": { swr: 3600 },
    "/productos/**": { swr: 3600 },
    "/admin/**": { cache: false },
    "/api/**": { cors: true },
    "/api/auth/refresh": { security: { rateLimiter: false } }
  },

  // content: {

  //   database: {
  //     type: 'sqlite',
  //     filename: 'vivero_emma.sqlite',
  //   },
  //   watch: {
  //     port: 4000,
  //     showURL: true,
  //   }
  // },
  openApiDocs: {
    folder: './docs',
    name: 'Vivero Emma API Documentation',
    files: function () { return { 'ApiVivero': 'Api Vivero' } }
  },


  //image
  image: {
    provider: 'netlify',
    formats: ['webp', 'jpg'],
    //dir: 'assets/images',
    domains: ['images.pexels.com', 'i.ibb.co', 'ibb.co', 'www.grupoalagalia.es', 'images.unsplash.com', 'pexels.com', 'unsplash.com', 'viveroemma.netlify.app', 'github.com'],
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
      htmlAttrs: { lang: 'es' },
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
    imgbbApiKey: process.env.IMGBB_API_KEY,
    // Secret Firebase keys (Server side)
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,

    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      // Public Firebase config (Client side)
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
  },


  components: [
    { path: '~/components', pathPrefix: false }, // Scans ~/components and subdirectories
  ],

  // Custom CSS
  css: ['~/assets/css/main.css'],
  plugins: [
    '~/plugins/auth.ts'
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Vivero Emma',
      short_name: 'Vivero Emma',
      description: 'El mejor vivero de Cuartel V, Moreno. Plantas y flores para tu hogar.',
      theme_color: '#166534', // green-800
      background_color: '#ffffff',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  },
  nitro: {
    preset: 'netlify',
    compressPublicAssets: true,


  }
})