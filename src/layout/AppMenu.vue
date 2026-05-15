<script setup>
import { ref } from "vue";
import AppMenuItem from "./AppMenuItem.vue";

const model = ref([
  {
    label: "Panel",
    items: [
      {
        label: "Resumen",
        icon: "pi pi-fw pi-chart-line",
        to: "/",
      },
    ],
  },
  {
    label: "Mi cuenta",
    items: [
      {
        label: "Información",
        icon: "pi pi-fw pi-id-card",
        to: "/account",
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
