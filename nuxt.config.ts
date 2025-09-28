import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/supabase',
    '@vueuse/nuxt'
  ],
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/']
    },
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
  },
  runtimeConfig: {
    // Private keys are only available on the server-side
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    // Public keys that are exposed to the client-side
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    }
  },
  // Components configuration
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  // Fix auto-imports
  imports: {
    dirs: [
      'composables',
      'lib/**'
    ]
  },
  // TypeScript configuration
  typescript: {
    strict: true
  }
})
