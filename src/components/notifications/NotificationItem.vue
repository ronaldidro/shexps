<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <i class="pi pi-fw" :class="iconClass[notification.type]" />
      <p class="font-semibold text-lg">{{ notification.title }}</p>
    </div>
    <Button
      type="button"
      icon="pi pi-ellipsis-v"
      @click="$emit('toggle', $event, notification)"
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
</template>

<script setup lang="ts">
import type { Notification, NotificationType } from '@/types/notification'

defineProps<{ notification: Notification }>()

defineEmits<{ toggle: [event: Event, notification: Notification] }>()

const successClass = 'pi-check-circle text-green-500'
const dangerClass = 'pi-times-circle text-red-500'
const warnClass = 'pi-exclamation-circle text-blue-500'

const iconClass: Record<NotificationType, string> = {
  expense_created: successClass,
  payment_created: successClass,
  expense_deleted: dangerClass,
  budget_exceeded: dangerClass,
  budget_tight: warnClass,
}
</script>
