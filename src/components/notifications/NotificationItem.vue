<template>
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
import type { Notification } from '@/types/notification'

defineProps<{ notification: Notification }>()

defineEmits<{ toggle: [event: Event, notification: Notification] }>()
</script>
