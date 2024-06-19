<script setup lang="ts">
import type { FormInst } from "naive-ui";

definePageMeta({
  middleware: ["protected"],
});

const route = useRoute();

const { appid, channelid } = route.params as {
  appid: string;
  channelid: string;
};

const timelinePeriod = ref("1h");

const timelinePeriodOptions = [
  { label: "1 hour", value: "1h" },
  { label: "1 day", value: "1d" },
  { label: "1 week", value: "1w" },
  { label: "1 month", value: "1m" },
  { label: "1 year", value: "1y" },
];

const { data, error } = await useFetch(
  `/api/applications/${appid}/channels/${channelid}`,
  {
    headers: useRequestHeaders(["cookie"]),
  },
);

if (error.value) {
  push.error("Failed to fetch application.");

  await navigateTo("/applications");
}
</script>

<template>
  <main>
    <div
      class="flex w-full items-center justify-start space-x-4 bg-white px-6 py-6"
    >
      <h1 class="text-3xl font-bold text-gray-900">
        Channel {{ data?.channel.name }}
      </h1>
    </div>

    <n-layout has-sider>
      <n-layout-sider
        bordered
        content-style="padding: 24px;"
        show-trigger="arrow-circle"
      >
        <n-collapse :default-expanded-names="['Timeline']">
          <n-collapse-item title="Timeline" name="Timeline">
            <n-select
              v-model:value="timelinePeriod"
              :options="timelinePeriodOptions"
            />
          </n-collapse-item>
        </n-collapse>
      </n-layout-sider>

      <n-layout>
        <n-layout-header bordered>
          <div class="flex space-x-2 px-3 pb-2">
            <div class="w-[166px]">Time</div>
            <div class="w-[72px]">Status</div>
            <div>Message</div>
          </div>
        </n-layout-header>
        <n-layout-content>
          <div
            class="flex space-x-2 px-3 py-1 font-mono text-sm"
            :class="{
              'bg-gray-100': index % 2 === 0,
            }"
            v-for="(log, index) in data?.logs"
            :key="log.id"
          >
            <div class="w-[166px]">
              {{ $dayjs(log.created).format("MMM DD HH:mm:ss.SSS") }}
            </div>
            <div class="w-[72px]">{{ log.level }}</div>
            <div>{{ log.message }}</div>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>

    <n-divider />
  </main>
</template>
