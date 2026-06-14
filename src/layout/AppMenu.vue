<script setup>
import AppMenuItem from './AppMenuItem.vue'
import { useNavItems } from '@/composables/useNavItems.ts'

const { items } = useNavItems()
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in [{ label: 'Panel', items }]" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
