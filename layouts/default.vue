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
    <div class="relative z-20 mx-auto w-full px-5">
      <header class="mb-2 flex items-center justify-between py-4">
        <nav class="hidden items-center gap-4 lg:flex">
          <NuxtLink
            href="/"
            aria-label="logo"
            class="mr-4 inline-flex items-center gap-2.5"
          >
            <img
              src="https://www.svgrepo.com/show/227168/log-wood.svg"
              alt="logwatch"
              class="h-8 w-8"
            />

            <span class="text-xl font-bold"> logwatch </span>
          </NuxtLink>
        </nav>

        <nav class="hidden items-center gap-4 lg:flex">
          <NuxtLink
            href="/applications"
            class="font-medium transition-all hover:text-slate-700"
          >
            Applications
          </NuxtLink>

          <NuxtLink
            href="https://github.com/megasanjay/logwatch"
            class="font-medium transition-all hover:text-slate-700"
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
