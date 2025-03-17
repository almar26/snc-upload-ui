import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: `%s %separator %siteName`,
      templateParams: {
        siteName: "SNC Upload Files",
        separator: "|",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  build: {
    transpile: ["vuetify"],
  },
  ssr: false,
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins?.push(vuetify({ autoImport: true }));
      });
    },
    '@pinia/nuxt'
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  typescript: {
    strict: false,
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL
    }
  }
});
