<script setup lang="ts">
import type { FormInst } from "naive-ui";

definePageMeta({
  middleware: ["protected"],
});

const route = useRoute();

const { appid } = route.params as { appid: string };

const newChannelModal = ref(false);
const submitLoading = ref(false);

const formRef = ref<FormInst | null>(null);
const formValue = reactive({
  name: "",
  slug: "",
  description: "",
});
const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
};

const { data: application, error } = await useFetch(
  `/api/applications/${appid}`,
  {
    headers: useRequestHeaders(["cookie"]),
  },
);

if (error.value) {
  push.error("Failed to fetch application.");

  await navigateTo("/applications");
}

const createChannel = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const body = {
        name: formValue.name,
        slug: formValue.slug,
        description: formValue.description,
      };

      submitLoading.value = true;

      await $fetch(`/api/applications/${appid}`, {
        method: "POST",
        headers: useRequestHeaders(["cookie"]),
        body: JSON.stringify(body),
      })
        .then((res) => {
          if ("channel" in res) {
            application.value?.channels.push(res.channel);
            push.success("Channel created successfully.");

            newChannelModal.value = false;
          } else {
            push.error("Failed to create channel.");
          }
        })
        .catch((err) => {
          console.log(err);
          push.error("Failed to create channel.");
        })
        .finally(() => {
          submitLoading.value = false;
        });
    } else {
      console.log(errors);
      push.error("Please fill in the required fields.");
    }
  });
};
</script>

<template>
  <main>
    <div
      class="flex w-full items-center justify-start space-x-4 bg-white px-6 py-6"
    >
      <h1 class="text-3xl font-bold text-gray-900">Channels</h1>

      <n-button color="black" @click="newChannelModal = true">
        <template #icon>
          <Icon name="mdi:plus" />
        </template>
      </n-button>

      <n-modal v-model:show="newChannelModal" transform-origin="center">
        <n-card
          style="width: 600px"
          title="Create New Channel"
          :bordered="true"
          size="huge"
          aria-modal="true"
        >
          <template #header-extra>
            <n-button @click="newChannelModal = false">
              <template #icon>
                <Icon name="mdi:close" />
              </template>
            </n-button>
          </template>

          <n-form ref="formRef" :model="formValue" :rules="rules">
            <n-form-item label="Channel Name" path="name">
              <n-input
                v-model:value="formValue.name"
                placeholder="Staging"
                maxlength="100"
                show-count
                clearable
                data-1p-ignore
              />
            </n-form-item>

            <n-form-item label="Slug" path="slug">
              <n-input
                v-model:value="formValue.slug"
                placeholder="stg"
                maxlength="100"
                show-count
                autocomplete="off"
                clearable
              />
            </n-form-item>

            <n-form-item label="Description" path="description">
              <n-input
                v-model:value="formValue.description"
                placeholder="The staging environment for the app"
                type="textarea"
                maxlength="256"
                show-count
                clearable
              />
            </n-form-item>
          </n-form>

          <template #footer>
            <n-button
              type="primary"
              @click="createChannel"
              color="black"
              :loading="submitLoading"
            >
              <template #icon>
                <Icon name="mdi:plus" />
              </template>

              Create channel
            </n-button>
          </template>
        </n-card>
      </n-modal>
    </div>

    <div class="divide divide-y p-10">
      <NuxtLink
        :to="`/applications/${application?.id}/channels/${channel.id}`"
        v-for="channel in application?.channels || []"
        :key="channel.id"
        class="flex min-h-[65px] cursor-pointer items-center px-2 py-3 transition-all hover:bg-slate-100"
      >
        <div class="flex-1">
          <div class="flex flex-col">
            <n-flex>
              <span
                class="text-blue-500 transition-all hover:text-blue-600 hover:underline"
              >
                {{ channel.name }}
              </span>

              <n-tag type="success">{{ channel.slug }}</n-tag>
            </n-flex>

            <p class="text-gray-500">{{ channel.description }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </main>
</template>
