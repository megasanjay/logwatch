<script setup lang="ts">
import { useApplicationStore } from "@/stores/application";

const devMode = process.env.NODE_ENV === "development";

const showMobileMenu = ref(false);

const applicationStore = useApplicationStore();
const route = useRoute();

const appid = ref<string | null>(null);
const channelid = ref<string | null>(null);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const allApplications = computed(() => {
  if (!appid.value) return [];

  if (!applicationStore.applications.length) {
    return [];
  }

  const apps = applicationStore.applications.map((app) => {
    return {
      label: app.name,
      value: app.id,
    };
  });

  return apps;
});

const allChannels = computed(() => {
  if (!appid.value) {
    return [];
  }

  if (!applicationStore.applications.length) {
    return [];
  }

  const application = applicationStore.applications.find(
    (app) => app.id === appid.value,
  );

  if (!application) {
    return [];
  }

  return application?.channels || [];
});

const getAllApplications = async () => {
  const { data: applications, error } = await useFetch("/api/applications", {
    headers: useRequestHeaders(["cookie"]),
  });

  if (applications.value) {
    applicationStore.setApplications(applications as unknown as Application[]);
  }
};

watchEffect(() => {
  const aid = route.params.appid as string;
  const cid = route.params.channelid as string;

  if (aid) {
    appid.value = aid;
    getAllApplications();
  }

  if (cid) {
    channelid.value = cid;
  }
});
</script>

<template>
  <div
    class="relative mx-auto flex h-full min-h-screen w-full flex-col bg-slate-50"
    :class="{ 'debug-screens': devMode }"
  >
    <div class="relative z-20 mx-auto w-full px-5">
      <header class="mb-2 flex items-center justify-between py-4">
        <nav class="items-center">
          <n-flex>
            <NuxtLink
              href="/"
              aria-label="logo"
              class="inline-flex items-center gap-2.5"
            >
              <img
                src="https://www.svgrepo.com/show/227168/log-wood.svg"
                alt="logwatch"
                class="h-8 w-8"
              />

              <span class="text-xl font-bold"> logwatch </span>
            </NuxtLink>

            <TransitionFade>
              <n-flex v-if="appid">
                <svg
                  fill="none"
                  shape-rendering="geometricPrecision"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  class="h-8 w-8 text-slate-300"
                >
                  <path d="M16.88 3.549L7.12 20.451"></path>
                </svg>

                <n-popselect v-model:value="appid" :options="allApplications">
                  <n-button>{{ appid }}</n-button>
                </n-popselect>
              </n-flex>
            </TransitionFade>

            <TransitionFade>
              <n-flex v-if="channelid">
                <svg
                  fill="none"
                  shape-rendering="geometricPrecision"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  class="h-8 w-8 text-slate-300"
                >
                  <path d="M16.88 3.549L7.12 20.451"></path>
                </svg>

                <n-popselect
                  v-model:value="channelid"
                  :options="allChannels"
                  v-if="channelid"
                >
                  <n-button>{{ channelid }}</n-button>
                </n-popselect>
              </n-flex>
            </TransitionFade>
          </n-flex>
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
