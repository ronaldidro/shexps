<template>
  <div class="flex items-center justify-between">
    <p class="text-xl font-medium mb-0!">
      {{ group.name }}
    </p>
    <Button
      type="button"
      icon="pi pi-ellipsis-v"
      @click="$emit('toggle', $event, group)"
      class="p-button-text p-button-plain w-5!"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    />
  </div>
  <p class="text-primary font-medium">{{ group.members }} miembro(s)</p>
  <p class="text-muted-color font-medium">Creado el {{ group.createdAt }}</p>
  <Accordion>
    <AccordionPanel value="0">
      <AccordionHeader class="px-0!">Miembros</AccordionHeader>
      <AccordionContent unstyled class="pb-4">
        <div class="flex flex-wrap gap-2">
          <Tag v-for="membership in group.memberships" :key="membership.id">
            {{ membership.user.firstName }}
            <span v-if="membership.user.id === group.user.id">(C)</span>
          </Tag>
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<script setup lang="ts">
import type { Group } from '@/types/group'

defineProps<{ group: Group }>()

defineEmits<{ toggle: [event: Event, group: Group] }>()
</script>
