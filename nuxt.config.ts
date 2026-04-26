// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/hints',
    '@nuxt/test-utils',
    'nuxt-icons',
    '@nuxtjs/supabase',
    '@vercel/analytics/nuxt',
    '@vercel/speed-insights/nuxt'
  ],

  devtools: {
    enabled: true
  },

  devServer: {
    https: true
  },

  css: ['~/assets/css/main.css'],

  supabase: {
    redirectOptions: {
      login: '/admin/login',
      callback: '/admin',
      exclude: ['/', '/join/*', '/cancel/*']
    }
  },

  routeRules: {
    '/': { prerender: false }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})