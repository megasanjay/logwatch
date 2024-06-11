<script setup lang="ts">
import type { FormInst } from "naive-ui";

definePageMeta({
  middleware: ["protected"],
});

const newApplicationModal = ref(false);
const submitLoading = ref(false);

const formRef = ref<FormInst | null>(null);
const formValue = reactive({
  name: "",
  description: "",
});
const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
};

const { data: applications, error } = await useFetch("/api/applications", {
  headers: useRequestHeaders(["cookie"]),
});

const createApplication = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const body = {
        name: formValue.name,
        description: formValue.description,
      };

      submitLoading.value = true;

      await $fetch("/api/applications", {
        method: "POST",
        headers: useRequestHeaders(["cookie"]),
        body: JSON.stringify(body),
      })
        .then((res) => {
          if ("application" in res) {
            applications.value?.push(res.application);
            push.success("Application created successfully.");

            newApplicationModal.value = false;
          } else {
            push.error("Failed to create application.");
          }
        })
        .catch((err) => {
          console.log(err);
          push.error("Failed to create application.");
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
      <h1 class="text-3xl font-bold text-gray-900">Applications</h1>

      <n-button color="black" @click="newApplicationModal = true">
        <template #icon>
          <Icon name="mdi:plus" />
        </template>
      </n-button>

      <n-modal v-model:show="newApplicationModal" transform-origin="center">
        <n-card
          style="width: 600px"
          title="Create New Application"
          :bordered="true"
          size="huge"
          aria-modal="true"
        >
          <template #header-extra>
            <n-button @click="newApplicationModal = false">
              <template #icon>
                <Icon name="mdi:close" />
              </template>
            </n-button>
          </template>

          <n-form ref="formRef" :model="formValue" :rules="rules">
            <n-form-item label="Name" path="name">
              <n-input
                v-model:value="formValue.name"
                placeholder="My awesome app"
                maxlength="100"
                show-count
                clearable
              />
            </n-form-item>

            <n-form-item label="Description" path="description">
              <n-input
                v-model:value="formValue.description"
                placeholder="A short description"
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
              @click="createApplication"
              color="black"
              :loading="submitLoading"
            >
              Create
            </n-button>
          </template>
        </n-card>
      </n-modal>
    </div>

    <div class="p-10">{{ applications }}</div>
  </main>
</template>
