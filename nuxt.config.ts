// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/hints',
    '@nuxt/test-utils',
    'nuxt-icons',
    '@nuxtjs/supabase'
  ],

  devtools: {
    enabled: true
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
    '/': { prerender: false },
    '/admin/**': { ssr: false }
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
