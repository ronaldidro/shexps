<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();

onMounted(async () => {
  if (!authStore.token) return;

  try {
    await authStore.fetchUser();
  } catch {
    authStore.logout();
  }
});
</script>
