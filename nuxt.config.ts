import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  devServer: {
    port: 3001,
  },

  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@primevue/nuxt-module', '@pinia/nuxt'],

  runtimeConfig: {
    public: {
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID || ''
    }
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
        ripple: true,
        options: {
          darkModeSelector: '.app-dark'
        }
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