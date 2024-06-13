<script setup lang="ts">
const devMode = process.env.NODE_ENV === "development";

const showMobileMenu = ref(false);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};
</script>

<template>
  <div
    class="relative mx-auto flex h-full min-h-screen w-full flex-col bg-slate-50"
    :class="{ 'debug-screens': devMode }"
  >
    <div class="relative z-20 mx-auto w-full bg-slate-800 px-5 text-white">
      <header class="mb-2 flex items-center justify-between py-4">
        <nav class="hidden items-center gap-4 lg:flex">
          <NuxtLink
            href="/"
            class="mr-4 inline-flex items-center gap-2.5 text-xl font-bold"
            aria-label="logo"
          >
            <img
              src="https://www.svgrepo.com/show/227168/log-wood.svg"
              alt="logwatch"
              class="h-8 w-8"
            />

            logwatch
          </NuxtLink>

          <NuxtLink
            href="/applications"
            class="font-medium text-white transition-all hover:text-slate-200"
          >
            Dashboard
          </NuxtLink>

          <NuxtLink
            href="/applications"
            class="font-medium text-white transition-all hover:text-slate-200"
          >
            Applications
          </NuxtLink>
        </nav>

        <nav class="hidden items-center gap-4 lg:flex">
          <NuxtLink
            href="https://github.com/megasanjay/logwatch"
            class="font-medium text-white transition-all hover:text-slate-200"
          >
            <div class="flex items-center">
              GitHub
              <Icon name="gridicons:external" size="15" class="ml-1" />
            </div>
          </NuxtLink>

          <div>
            <ProfileStatus />
          </div>
        </nav>
      </header>
    </div>

    <div class="relative z-10 grow">
      <slot />
    </div>
  </div>
</template>
