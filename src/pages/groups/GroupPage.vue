<template>
  <AppBreadcrumb :items />
  <div v-if="group" class="card md:max-w-sm">
    <GroupForm
      :initialValues="{ name: group.name, members }"
      :loading="updating"
      leftButtonLabel="Regresar"
      @click:leftButton="router.push({ name: 'groups' })"
      @submit="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import type { GroupPayload } from '@/types/group'
import GroupForm from '@/components/groups/GroupForm.vue'
import { useNotification } from '@/composables/useNotification'
import { useGroupQuery } from '@/composables/query/useGroupQuery'
import router from '@/router'

const route = useRoute()
const { showToast } = useNotification()
const { findOne, update } = useGroupQuery()

const { data: group } = findOne(route.params.id as string)
const { mutate: updateGroup, isPending: updating } = update()

const members = computed(() => {
  if (!group.value) return []

  return group.value.memberships
    .filter((membership) => membership.user.id !== group.value?.user.id)
    .map((membership) => membership.user.id)
})

const items = computed(() => {
  if (!group.value) return []
  return [{ label: 'Grupos', route: '/groups' }, { label: group.value.name }]
})

const handleUpdate = async (values: GroupPayload) => {
  if (!group.value) return

  updateGroup(
    { id: group.value?.id, payload: values },
    {
      onSuccess: () => {
        showToast({ severity: 'success', summary: 'Grupo actualizado correctamente' })
        router.push({ name: 'groups' })
      },
    },
  )
}
</script>
