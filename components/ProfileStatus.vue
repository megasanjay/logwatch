<script setup lang="ts">
const user = useUser();
const route = useRoute();

const loggedIn = computed(() => !!user.value);
const onLoginPage = computed(() => route.path === "/login");

async function logout() {
  await $fetch("/api/logout", {
    method: "POST",
  });
  window.location.href = "/";
}
</script>

<template>
  <n-flex v-if="loggedIn" align="center">
    <NuxtLink to="/profile" class="flex items-center">
      <n-avatar
        round
        :src="`https://avatars.githubusercontent.com/u/${user?.githubId}?v=4`"
        :fallback-src="`https://api.dicebear.com/8.x/adventurer/svg?seed=${user?.githubId}`"
        class="transition-all hover:opacity-90"
      />
    </NuxtLink>

    <n-button color="black" @click="logout"> Sign Out </n-button>
  </n-flex>

  <div v-else>
    <a v-if="!onLoginPage" href="/login/github">
      <n-button color="black">
        <template #icon>
          <Icon name="bi:github" />
        </template>

        Sign in with GitHub
      </n-button>
    </a>
  </div>
</template>
