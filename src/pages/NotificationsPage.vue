<template>
  <AppBreadcrumb :items="[{ label: 'Notificaciones' }]" />
  <div class="card p-2!">
    <div ref="el" class="overflow-y-auto h-dvh">
      <div
        v-for="(notification, index) in notifications"
        :key="notification.id"
        class="p-3 rounded-md"
        :class="{ 'mt-2': index !== 0, 'bg-gray-100 dark:bg-gray-700': !notification.isRead }"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i
              class="pi pi-fw"
              :class="{
                'pi-check-circle text-green-500': notification.type.includes('created'),
                'pi-times-circle text-red-500': notification.type.includes('deleted'),
              }"
            />
            <p class="font-semibold text-lg">{{ notification.title }}</p>
          </div>
          <Button
            type="button"
            icon="pi pi-ellipsis-v"
            @click="(e) => toggle(e, notification)"
            class="p-button-text p-button-plain w-5!"
            aria-haspopup="true"
            aria-controls="overlay_menu"
          />
        </div>
        <div class="text-surface-900 dark:text-surface-0 leading-normal">
          {{ notification.description }}
        </div>
        <div class="text-muted-color text-sm">
          {{ notification.createdAt }}
        </div>
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
import { computed, ref, useTemplateRef } from 'vue'
import type { Notification } from '@/types/notification'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import { useNotification } from '@/composables/useNotification'
import { useScrollPagination } from '@/composables/useScrollPagination'
import { notificationsService } from '@/services/notifications.service'
import { getErrorMessage } from '@/services/axios'

const el = useTemplateRef('el')

const { showToast } = useNotification()

const menu = ref()
const selected = ref<Notification | null>(null)

const items = computed(() => {
  const notification = selected.value

  if (!notification) return []

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
})

const {
  items: notifications,
  loading,
  reload,
} = useScrollPagination<Notification>({
  el,
  fetcher: notificationsService.getAll,
})

const toggle = (event: Event, notification: Notification) => {
  selected.value = notification
  menu.value.toggle(event)
}

const handleChangeStatus = async ({ id, isRead }: Notification) => {
  try {
    await notificationsService.update(id, { isRead: !isRead })

    const readStatus = isRead ? 'no leída' : 'leída'

    showToast({ severity: 'success', summary: `Notificación marcada como ${readStatus}` })

    await reload()
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}

const handleDelete = async (id: string) => {
  try {
    await notificationsService.remove(id)

    showToast({ severity: 'success', summary: 'Notificación eliminada correctamente' })

    await reload()
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}
</script>
