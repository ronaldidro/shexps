<template>
  <Tabs class="fixed bottom-0 w-full md:hidden! z-1010" :value="activeTab">
    <TabList :pt="{ tabList: { class: 'justify-between border-t!' } }">
      <Tab v-for="tab in items" :key="tab.label" :value="tab.to">
        <router-link v-if="tab.to" v-slot="{ href, navigate }" :to="tab.to" custom>
          <a
            v-ripple
            :href="href"
            @click="navigate"
            class="flex flex-col items-center gap-2 text-inherit"
          >
            <i :class="tab.icon" />
            <span>{{ tab.label }}</span>
          </a>
        </router-link>
      </Tab>
    </TabList>
  </Tabs>
</template>

<script setup lang="ts">
import { useNavItems } from '@/composables/useNavItems'

const { items, activeTab } = useNavItems()
</script>
