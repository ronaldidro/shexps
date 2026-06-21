<template>
  <AppBreadcrumb :items="[{ label: 'Mi perfil' }]" />
  <div class="card p-2! md:max-w-sm">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Información básica</Tab>
        <Tab value="1">Cambiar contraseña</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <BasicInfoPanel />
        </TabPanel>
        <TabPanel value="1">
          <PasswordPanel />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import BasicInfoPanel from '@/components/account/BasicInfoPanel.vue'
import PasswordPanel from '@/components/account/PasswordPanel.vue'
</script>
