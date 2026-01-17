import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  devServer: {
    port: 3001,
  },

  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@primevue/nuxt-module'],
  primevue: {
    /* Configuration */
    options: {
      theme: {
        ripple: true,
        preset: Aura
      }
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss()
    ]
  }
});