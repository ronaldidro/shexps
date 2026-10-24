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
  <div v-if="fetching" class="text-center pt-5">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div v-for="(group, index) in groups" :key="index" class="card mb-0!">
      <GroupItem :group="group" @toggle="toggleMenu" />
    </div>
  </div>
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  <GroupDialog v-model:visible="showDialog.group" @submit="handleCreate" :loading="creating" />
  <MembershipDialog
    v-model:visible="showDialog.membership"
    :initialValues="{ budget: membershipSelected.budget! }"
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
import { useNotification } from '@/composables/useNotification'
import { useGroupQuery } from '@/composables/query/useGroupQuery'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const confirm = useConfirm()
const { user } = useAuthStore()
const { showToast } = useNotification()
const { findAll, create, updateMembership, remove } = useGroupQuery()

const group = ref<Group | null>(null)
const menu = ref()
const search = ref('')
const params = ref({ search: '' })

const { data: groups, isLoading: fetching } = findAll(params)
const { mutate: createGroup, isPending: creating } = create()
const { mutate: removeGroup } = remove()
const { mutate: editMembership } = updateMembership()

const showDialog = reactive({ group: false, membership: false })
const membershipSelected = reactive<MembershipPayload>({ id: '', budget: null })

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
  params.value = { search: value }
}

const handleUpdateMembership = async (values: MembershipPayload) => {
  const membershipId = membershipSelected.id

  if (!membershipId) return

  editMembership(
    { id: membershipId, payload: values },
    {
      onSuccess: () =>
        showToast({ severity: 'success', summary: 'Membresía actualizada correctamente' }),
    },
  )
}

const handleCreate = async (values: GroupPayload) =>
  createGroup(values, {
    onSuccess: () => {
      showToast({ severity: 'success', summary: 'Grupo registrado correctamente' })
      showDialog.group = false
    },
  })

const handleDelete = async (id: string) =>
  removeGroup(id, {
    onSuccess: () => showToast({ severity: 'success', summary: 'Grupo eliminado correctamente' }),
  })
</script>
