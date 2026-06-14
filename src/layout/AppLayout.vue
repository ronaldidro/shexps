<script setup>
import { useLayout } from '@/layout/composables/layout'
import { computed, onErrorCaptured, reactive } from 'vue'
import AppFooter from './AppFooter.vue'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import ErrorPage from '@/pages/ErrorPage.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import AppTabMenu from '@/layout/AppTabMenu.vue'

const { layoutConfig, layoutState, hideMobileMenu } = useLayout()

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
  if (import.meta.env.DEV) console.error(stack)

  error.exists = true
  error.message = message
  return false
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
