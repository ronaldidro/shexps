<template>
  <div class="mb-7 rounded-md">
    <Breadcrumb :home :model="items" class="p-0! bg-transparent!">
      <template #item="{ item, props }">
        <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span :class="[item.icon, 'text-color']" />
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        </RouterLink>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-700 dark:text-surface-0">
            {{ item.label }}
          </span>
        </a>
      </template>
    </Breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ items: { label: string; route?: string }[] }>()

const home = ref({ icon: 'pi pi-home', route: '/' })
</script>
