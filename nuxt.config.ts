// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "logwatch",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
    },
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" },
  },

  colorMode: {
    classPrefix: "",
    classSuffix: "-mode",
    componentName: "ColorScheme",
    fallback: "light", // fallback value if not system preference found
    globalName: "__NUXT_COLOR_MODE__",
    hid: "nuxt-color-mode-script",
    preference: "light", // default value of $colorMode.preference
    storageKey: "nuxt-color-mode",
  },

  css: [
    "@/assets/css/tailwind.css",
    "notivue/notification.css", // Only needed if using built-in notifications
    "notivue/animations.css", // Only needed if using built-in animations
  ],

  devtools: { enabled: true },

  // helm: {
  //   crossOriginResourcePolicy: "cross-origin",
  // },

  modules: [
    "@nuxtjs/tailwindcss",
    "@bg-dev/nuxt-naiveui",
    "notivue/nuxt",
    "@nuxtjs/color-mode",
    "dayjs-nuxt",
    "@pinia/nuxt",
    // "nuxt-helm",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Inter: true,
        },
      },
    ],
    "nuxt-icon",
  ],

  nitro: {
    azure: {
      config: {
        platform: {
          apiRuntime: "node:18",
        },
      },
    },
    preset: "azure",
  },

  notivue: {
    position: "bottom-right",
  },
});
