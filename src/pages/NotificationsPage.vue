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
  <p v-if="isLoading" class="text-center pt-5">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </p>
  <p v-else-if="!data?.items.length" class="text-center text-lg pt-5">
    <i class="pi pi-info-circle pr-2" />
    No se encontraron notificaciones
  </p>
  <div v-else class="card p-2!">
    <div
      v-for="(notification, index) in data?.items"
      :key="notification.id"
      class="p-3 rounded-md"
      :class="{ 'mt-2': index !== 0, 'bg-gray-100 dark:bg-gray-700': !notification.isRead }"
    >
      <NotificationItem :notification @toggle="toggleMenuItem" />
    </div>
  </div>
  <ScrollTop
    icon="pi pi-arrow-up"
    :buttonProps="{ severity: 'contrast', raised: true, rounded: true, class: 'mb-20 md:mb-0' }"
  />
  <div ref="sentinel"></div>
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { Notification } from '@/types/notification'
import type { QueryParams } from '@/types/pagination'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import { useNotification } from '@/composables/useNotification'
import { useNotificationQuery } from '@/composables/query/useNotificationQuery'
import NotificationItem from '@/components/notifications/NotificationItem.vue'
import { useAuthStore } from '@/stores/auth.store'

const { showToast } = useNotification()
const { user, setHasNotifications } = useAuthStore()
const { findAll, update, updateAll, remove } = useNotificationQuery()

const menu = ref()
const sentinel = ref(null)
const option = ref<'read' | 'unread' | 'all'>('all')
const selected = ref<Notification | null>(null)

const filters = computed<Partial<QueryParams>>(() =>
  option.value === 'all' ? { status: undefined } : { status: option.value },
)

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = findAll(filters)
const { mutate: updateNotification } = update()
const { mutate: updateNotifications } = updateAll()
const { mutate: removeNotification } = remove()

useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) fetchNextPage()
})

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

  return [
    {
      label: 'Marcar todas como leídas',
      icon: 'pi pi-fw pi-check',
      command: handleReadAll,
      disabled: !user.hasNotifications,
    },
  ]
})

watch(
  () => data.value?.meta?.unread,
  (unread) => {
    if (typeof unread !== 'number') return
    setHasNotifications(unread > 0)
  },
)

const toggleMenuItem = (event: Event, notification: Notification) => {
  selected.value = notification
  menu.value.toggle(event)
}

const toggleTopMenu = (event: Event) => {
  selected.value = null
  menu.value.toggle(event)
}

const handleChangeStatus = ({ id, isRead }: Notification) =>
  updateNotification(
    { id, payload: { isRead: !isRead } },
    {
      onSuccess: () => {
        showToast({
          severity: 'success',
          summary: `Notificación marcada como ${isRead ? 'no leída' : 'leída'}`,
        })
        option.value = 'all'
      },
    },
  )

const handleReadAll = () =>
  updateNotifications(
    { payload: { isRead: true } },
    {
      onSuccess: () => {
        showToast({ severity: 'success', summary: `Notificaciones marcadas como leídas` })
        option.value = 'all'
      },
    },
  )

const handleDelete = (id: string) =>
  removeNotification(id, {
    onSuccess: () => {
      showToast({ severity: 'success', summary: 'Notificación eliminada correctamente' })
      option.value = 'all'
    },
  })
</script>
