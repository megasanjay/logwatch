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

const loading = ref(false);
const liveLogsLoading = ref(false);
const timelinePeriod = ref(300);

const shouldGetLiveLogs = ref(false);

const liveLogsInterval = ref<NodeJS.Timeout | null>(null);

const timelinePeriodOptions = [
  {
    label: "5 minutes",
    value: 300,
  },
  {
    label: "1 hour",
    value: 3600,
  },
  {
    label: "1 day",
    value: 86400,
  },
];

const logsData = ref<LogEvent[]>([]);

const { data, error } = await useFetch(
  `/api/applications/${appid}/channels/${channelid}`,
  {
    headers: useRequestHeaders(["cookie"]),
    query: {
      period: timelinePeriod.value,
    },
  },
);

if (error.value) {
  push.error("Failed to fetch channel data.");

  await navigateTo("/applications");
}

if (data.value) {
  logsData.value = data.value.logs as unknown as LogEvent[];
}

const onTimelinePeriodChange = async (value: number) => {
  if (value === 0) {
    // Live
    return;
  }

  if (value === timelinePeriod.value) {
    return;
  }

  timelinePeriod.value = value;

  loading.value = true;

  await $fetch(`/api/applications/${appid}/channels/${channelid}`, {
    headers: useRequestHeaders(["cookie"]),
    query: {
      period: value,
    },
  })
    .then((res) => {
      console.log("onTimelinePeriodChange", res);
      logsData.value = res.logs as unknown as LogEvent[];
    })
    .catch(() => {
      push.error("Failed to fetch channel data.");

      navigateTo("/applications");
    })
    .finally(() => {
      loading.value = false;
    });
};

const getLiveLogs = async (lastLogId: number) => {
  liveLogsLoading.value = true;

  await $fetch(`/api/applications/${appid}/channels/${channelid}/live`, {
    headers: useRequestHeaders(["cookie"]),
    query: {
      lastLogId,
    },
  })
    .then((res) => {
      if (res.logs.length === 0) {
        return;
      }

      // Add the new logs to the beginning of the array
      logsData.value = [
        ...(res.logs as unknown as LogEvent[]),
        ...(logsData.value as unknown as LogEvent[]),
      ];
    })
    .catch(() => {
      push.error("Failed to fetch channel data.");
    })
    .finally(() => {
      liveLogsLoading.value = false;
    });
};

const setLiveLogs = async (value: boolean) => {
  if (!value) {
    if (liveLogsInterval.value) {
      clearInterval(liveLogsInterval.value);
    }
    return;
  }

  liveLogsInterval.value = setInterval(async () => {
    // Get the id of the last log
    const lastLogId = logsData.value[0].id;

    await getLiveLogs(lastLogId);
  }, 1500);
};
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
        content-style="padding: 0px 24px 24px 24px"
        show-trigger="arrow-circle"
      >
        <n-collapse :default-expanded-names="['Timeline', 'Live']">
          <n-collapse-item title="Live" name="Live">
            <n-switch
              v-model:value="shouldGetLiveLogs"
              size="large"
              @update:value="setLiveLogs"
              :loading="liveLogsLoading"
            >
              <template #icon>
                <Icon name="meteocons:lightning-bolt-fill" />
              </template>
            </n-switch>
          </n-collapse-item>
          <n-collapse-item title="Timeline" name="Timeline">
            <n-select
              v-model:value="timelinePeriod"
              :options="timelinePeriodOptions"
              :on-update:value="onTimelinePeriodChange"
              :loading="loading"
            />
          </n-collapse-item>
        </n-collapse>
      </n-layout-sider>

      <n-layout>
        <n-layout-header bordered>
          <div class="mx-3 flex space-x-2 px-3 pb-2">
            <div class="w-[17px]"></div>
            <div class="w-[166px]">Time</div>
            <div class="w-[72px]">Status</div>
            <div>Message</div>
          </div>
        </n-layout-header>
        <n-layout-content class="px-3 py-2">
          <n-spin :show="loading">
            <div
              class="mx-1 flex cursor-pointer items-center space-x-2 rounded-md px-3 py-1 font-mono text-sm transition-all hover:bg-gray-100"
              :class="{
                'bg-slate-100': index % 2 === 0,
              }"
              v-for="(log, index) in logsData"
              :key="log.id"
            >
              <div class="flex w-[17px] items-center justify-center">
                <Icon
                  name="ic:round-warning"
                  size="20"
                  v-if="log.level === 'warn'"
                  class="text-yellow-500"
                />
                <Icon
                  name="ph:info-fill"
                  size="20"
                  v-if="log.level === 'info'"
                  class="text-blue-500"
                />
                <Icon
                  name="clarity:error-solid"
                  size="20"
                  v-if="log.level === 'error'"
                  class="text-red-500"
                />
                <Icon
                  name="icon-park-solid:error"
                  size="12"
                  v-if="log.level === 'fatal'"
                  class="text-red-500"
                />
              </div>
              <div class="w-[166px]">
                {{ $dayjs(log.created).format("MMM DD HH:mm:ss.SSS") }}
              </div>
              <div class="w-[72px]">{{ log.level }}</div>
              <div>{{ log.message }}</div>
            </div>
          </n-spin>
        </n-layout-content>
      </n-layout>
    </n-layout>

    <n-divider />
  </main>
</template>
