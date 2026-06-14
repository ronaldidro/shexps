<template>
  <Avatar
    :label="userLabel"
    shape="circle"
    class="h-10! w-10! cursor-pointer"
    aria-haspopup="true"
    aria-controls="overlay_menu"
    @click="(e: MouseEvent) => menu.toggle(e)"
  />
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
    <template #item="{ item, props }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>
      <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
      </a>
    </template>
  </Menu>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const { user, logout } = useAuthStore()

const userLabel = computed(() =>
  user.name
    ?.split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase(),
)

const menu = ref()

const items = reactive([
  { label: 'Perfil', icon: 'pi pi-fw pi-id-card', route: '/account' },
  { label: 'Contraseña', icon: 'pi pi-fw pi-key', route: '/account/password' },
  { separator: true },
  { label: 'Cerrar sesión', icon: 'pi pi-fw pi-sign-out', command: () => logout() },
])
</script>
