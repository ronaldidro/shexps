<template>
  <AppBreadcrumb :items="[{ label: 'Notificaciones' }]" />
  <div class="flex justify-between mb-2">
    <SelectButton
      v-model="option"
      :options="[
        { label: 'Todas', value: 'all' },
        { label: 'Leídas', value: 'read' },
        { label: 'No leídas', value: 'unread' },
      ]"
      optionLabel="label"
      optionValue="value"
    />
    <Button
      type="button"
      icon="pi pi-ellipsis-v"
      @click="toggleTopMenu"
      class="p-button-text p-button-plain w-5!"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    />
  </div>
  <div class="card p-2!">
    <div ref="el" class="overflow-y-auto h-dvh">
      <div
        v-for="(notification, index) in notifications"
        :key="notification.id"
        class="p-3 rounded-md"
        :class="{ 'mt-2': index !== 0, 'bg-gray-100 dark:bg-gray-700': !notification.isRead }"
      >
        <NotificationItem :notification @toggle="toggleMenuItem" />
      </div>
      <p v-if="loading" class="text-center pt-5">
        <ProgressSpinner style="width: 50px; height: 50px" />
      </p>
      <p v-else-if="!notifications.length" class="text-center text-lg pt-5">
        <i class="pi pi-info-circle pr-2" />
        No se encontraron notificaciones
      </p>
      <ScrollTop
        target="parent"
        icon="pi pi-arrow-up"
        :buttonProps="{ severity: 'contrast', raised: true, rounded: true }"
      />
    </div>
  </div>
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import type { Notification } from '@/types/notification'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import { useNotification } from '@/composables/useNotification'
import { useScrollPagination } from '@/composables/useScrollPagination'
import { notificationsService } from '@/services/notifications.service'
import NotificationItem from '@/components/notifications/NotificationItem.vue'
import { getErrorMessage } from '@/services/axios'
import { useAuthStore } from '@/stores/auth.store'

const el = useTemplateRef('el')

const { showToast } = useNotification()
const { setHasNotifications } = useAuthStore()

const menu = ref()
const option = ref<'read' | 'unread' | 'all'>('all')
const selected = ref<Notification | null>(null)

const items = computed(() => {
  const notification = selected.value

  if (notification)
    return [
      {
        label: notification.isRead ? 'Marcar como no leída' : 'Marcar como leída',
        icon: 'pi pi-fw pi-check',
        command: () => handleChangeStatus(notification),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-times',
        command: () => handleDelete(notification.id),
      },
    ]

  return [{ label: 'Marcar todas como leídas', icon: 'pi pi-fw pi-check', command: handleReadAll }]
})

const {
  items: notifications,
  meta,
  loading,
  reload,
  setFilters,
} = useScrollPagination<Notification>({
  el,
  fetcher: notificationsService.getAll,
})

watch(
  () => meta.value?.unread,
  (unread) => {
    if (typeof unread !== 'number') return
    setHasNotifications(unread > 0)
  },
)

watch(option, async (optionValue) => {
  const filter = optionValue === 'all' ? { status: undefined } : { status: optionValue }
  await setFilters(filter)
})

const toggleMenuItem = (event: Event, notification: Notification) => {
  selected.value = notification
  menu.value.toggle(event)
}

const toggleTopMenu = (event: Event) => {
  selected.value = null
  menu.value.toggle(event)
}

const handleChangeStatus = async ({ id, isRead }: Notification) => {
  try {
    await notificationsService.update(id, { isRead: !isRead })

    const readStatus = isRead ? 'no leída' : 'leída'

    showToast({ severity: 'success', summary: `Notificación marcada como ${readStatus}` })

    await reload()

    option.value = 'all'
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}

const handleReadAll = async () => {
  try {
    await notificationsService.updateAll({ isRead: true })

    showToast({ severity: 'success', summary: `Notificaciones marcadas como leídas` })

    await reload()

    option.value = 'all'
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}

const handleDelete = async (id: string) => {
  try {
    await notificationsService.remove(id)

    showToast({ severity: 'success', summary: 'Notificación eliminada correctamente' })

    await reload()

    option.value = 'all'
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}
</script>
