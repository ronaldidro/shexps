<script setup>
import { ref } from "vue";
import AppMenuItem from "./AppMenuItem.vue";

const model = ref([
  {
    label: "Movimientos",
    items: [
      {
        label: "Resumen",
        icon: "pi pi-fw pi-chart-line",
        to: "/",
      },
      {
        label: "Gastos",
        icon: "pi pi-fw pi-dollar",
      },
      {
        label: "Deudas",
        icon: "pi pi-fw pi-money-bill",
      },
      {
        label: "Pagos",
        icon: "pi pi-fw pi-wallet",
      },
    ],
  },
  {
    label: "Configuración",
    items: [
      {
        label: "Grupos",
        icon: "pi pi-fw pi-address-book",
        to: "/groups",
      },
    ],
  },
  {
    label: "Perfil",
    items: [
      {
        label: "Información",
        icon: "pi pi-fw pi-id-card",
        to: "/account",
      },
      {
        label: "Cambiar contraseña",
        icon: "pi pi-fw pi-key",
        to: "/account/password",
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
