<template>
  <nav>
    <router-link to="/">Dashboard</router-link>
    <router-link to="/account">Mi Cuenta</router-link>
    <button @click="authStore.logout()">Cerrar sesión</button>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();
</script>
