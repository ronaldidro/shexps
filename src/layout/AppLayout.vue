<script setup>
import { computed, onErrorCaptured, reactive, watch } from 'vue'
import { useEventSource } from '@vueuse/core'
import { useLayout } from '@/layout/composables/layout'
import AppTabMenu from '@/layout/AppTabMenu.vue'
import ErrorPage from '@/pages/ErrorPage.vue'
import { useNotification } from '@/composables/useNotification.ts'
import CardSkeleton from '@/components/CardSkeleton.vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import { API_URL, IS_DEV_ENV } from '@/utils/vite.ts'
import AppTopbar from './AppTopbar.vue'
import AppSidebar from './AppSidebar.vue'
import AppFooter from './AppFooter.vue'

const SSE_URL = `${API_URL}/notifications/stream`

const { layoutConfig, layoutState, hideMobileMenu } = useLayout()
const { showToast } = useNotification()
const { user, setHasNotifications } = useAuthStore()
const { data, event } = useEventSource(`${SSE_URL}?token=${user.token}`, ['info', 'error'])

const containerClass = computed(() => {
  return {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.mobileMenuActive,
    'layout-static-inactive': layoutState.staticMenuInactive,
  }
})

const error = reactive({ exists: false, message: '' })

onErrorCaptured(({ message, stack }) => {
  if (IS_DEV_ENV) console.error(stack)

  error.exists = true
  error.message = message
  return false
})

watch(data, (newData) => {
  if (!newData) return

  const { title, description } = JSON.parse(newData)

  setHasNotifications(true)

  showToast({ severity: event.value, summary: title, detail: description, life: 0 })
})
</script>

<template>
  <ErrorPage v-if="error.exists" :message="error.message" />
  <div v-else class="layout-wrapper" :class="containerClass">
    <AppTopbar />
    <AppSidebar />
    <div class="layout-main-container">
      <div class="layout-main">
        <RouterView v-slot="{ Component }">
          <template v-if="Component">
            <Suspense>
              <component :is="Component" />
              <template #fallback>
                <CardSkeleton />
              </template>
            </Suspense>
          </template>
        </RouterView>
      </div>
      <AppFooter />
    </div>
    <div class="layout-mask animate-fadein" @click="hideMobileMenu" />
    <AppTabMenu />
  </div>
</template>
