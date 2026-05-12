<template>
  <div>
    <AppNavbar />
    <h1>Dashboard</h1>
    <div v-if="authStore.user">
      <p>
        Bienvenido:
        {{ authStore.user.firstName }}
        {{ authStore.user.lastName }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from "@/components/AppNavbar.vue";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();
</script>
