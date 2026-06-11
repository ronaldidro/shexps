<template>
  <AppBreadcrumb :items />
  <div class="card md:max-w-sm" v-if="group">
    <GroupForm
      :initialValues="{ name: group.name, members }"
      @submit="onSubmit"
      leftButtonLabel="Regresar"
      @click:leftButton="router.push({ name: 'groups' })"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import type { Group, GroupPayload } from '@/types/group'
import { groupsService } from '@/services/groups.service'
import { getErrorMessage } from '@/services/axios'
import router from '@/router'
import GroupForm from '@/components/groups/GroupForm.vue'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const { showToast } = useNotification()

const group = ref<Group | null>(await groupsService.get(route.params.id as string))

const members = computed(() => {
  if (!group.value) return []

  return group.value.memberships
    .filter((membership) => membership.user.id !== group.value?.user.id)
    .map((membership) => membership.user.id)
})

const items = computed(() => {
  if (!group.value) return []
  return [
    { label: 'Configuración' },
    { label: 'Grupos', route: '/groups' },
    { label: group.value.name },
  ]
})

const onSubmit = async (values: GroupPayload) => {
  if (!group.value) return

  try {
    await groupsService.update(group.value.id, values)

    showToast({
      severity: 'success',
      summary: 'Grupo actualizado correctamente',
    })

    router.push({ name: 'groups' })
  } catch (err) {
    showToast({
      severity: 'error',
      summary: 'Error',
      detail: getErrorMessage(err),
    })
  }
}
</script>
