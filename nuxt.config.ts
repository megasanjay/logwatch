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

  modules: [
    "@nuxtjs/tailwindcss",
    "@bg-dev/nuxt-naiveui",
    "notivue/nuxt",
    "@nuxtjs/color-mode",
    "dayjs-nuxt",
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
    // ---- Uncomment for use with most other deployment mechanisms (Both server and vercel) ----
    // esbuild: {
    //   options: {
    //     target: "esnext",
    //   },
    // },
    // ---- Uncomment for use with most other deployment mechanisms (Both server and vercel) ----
    // ---- Uncomment to use Azure Functions ----
    // azure: {
    //   config: {
    //     platform: {
    //       apiRuntime: "node:20",
    //     },
    //   },
    // },
    // preset: "azure",
    // ---- Uncomment to use Azure Functions ----
  },

  notivue: {
    position: "bottom-right",
  },
});
