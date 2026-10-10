<template>
  <AppBreadcrumb :items="[{ label: 'Grupos' }]" />
  <Toolbar class="mb-7">
    <template #start>
      <SearchField v-model="search" @search="handleSearch" />
    </template>
    <template #end>
      <Button label="Nuevo" icon="pi pi-plus" @click="showDialog.group = true" />
    </template>
  </Toolbar>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div v-for="(group, index) in groups" :key="index" class="card mb-0!">
      <GroupItem :group="group" @toggle="toggleMenu" />
    </div>
  </div>
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  <GroupDialog v-model:visible="showDialog.group" @onSubmit="handleCreate" />
  <MembershipDialog
    v-model:visible="showDialog.membership"
    :initialValues="{ budget: membershipSelected.budget }"
    @submit="handleUpdateMembership"
  />
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useConfirm } from 'primevue'
import type { Group, GroupPayload } from '@/types/group'
import type { Membership, MembershipPayload } from '@/types/membership'
import GroupItem from '@/components/groups/GroupItem.vue'
import GroupDialog from '@/components/groups/GroupDialog.vue'
import MembershipDialog from '@/components/groups/MembershipDialog.vue'
import SearchField from '@/components/SearchField.vue'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import { getErrorMessage } from '@/services/axios'
import { groupsService } from '@/services/groups.service'
import { membershipsService } from '@/services/memberships.service'
import { useNotification } from '@/composables/useNotification'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const groups = ref<Group[]>(await groupsService.getAll())
const group = ref<Group | null>(null)
const search = ref('')
const menu = ref()

const showDialog = reactive({ group: false, membership: false })
const membershipSelected = reactive<{ id: string | null; budget: number | null }>({
  id: null,
  budget: null,
})

const { showToast } = useNotification()
const { user } = useAuthStore()
const confirm = useConfirm()

const items = computed(() => {
  const selected = group.value

  if (!selected) return []

  return [
    {
      label: 'Membresía',
      icon: 'pi pi-fw pi-id-card',
      command: () => openMembershipDialog(selected.memberships),
    },
    {
      label: 'Editar',
      icon: 'pi pi-fw pi-pencil',
      visible: selected.user.id === user.id,
      command: () => router.push({ name: 'group', params: { id: selected.id } }),
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-fw pi-times',
      visible: selected.user.id === user.id,
      command: () => openDeleteDialog(selected.id),
    },
  ]
})

const toggleMenu = (event: Event, selected: Group) => {
  group.value = selected
  menu.value.toggle(event)
}

const openDeleteDialog = (id: string) => {
  confirm.require({
    header: 'Eliminar grupo',
    message: '¿Está seguro de que desea continuar?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'No', severity: 'secondary', icon: 'pi pi-times', text: true },
    acceptProps: { label: 'Sí', severity: 'danger', icon: 'pi pi-check', outlined: true },
    accept: () => handleDelete(id),
  })
}

const openMembershipDialog = (memberships: Membership[]) => {
  const membership = memberships.find((membership) => membership.user.id === user.id)

  if (!membership) return

  membershipSelected.id = membership.id
  membershipSelected.budget = membership.budget ? Number(membership.budget) : membership.budget

  showDialog.membership = true
}

const handleSearch = async (value: string) => {
  search.value = value
  groups.value = await groupsService.getAll({ search: value })
}

const handleUpdateMembership = async (values: MembershipPayload) => {
  const membershipId = membershipSelected.id

  if (!membershipId) return

  try {
    await membershipsService.update(membershipId, values)

    groups.value = await groupsService.getAll()

    showToast({ severity: 'success', summary: 'Membresía actualizada correctamente' })
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}

const handleCreate = async (values: GroupPayload) => {
  try {
    await groupsService.create(values)

    groups.value = await groupsService.getAll()

    showToast({ severity: 'success', summary: 'Grupo registrado correctamente' })
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}

const handleDelete = async (id: string) => {
  try {
    await groupsService.remove(id)

    groups.value = await groupsService.getAll()

    showToast({ severity: 'success', summary: 'Grupo eliminado correctamente' })
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}
</script>
