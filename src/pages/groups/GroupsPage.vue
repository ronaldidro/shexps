<template>
  <AppBreadcrumb :items="[{ label: 'Grupos' }]" />
  <Toolbar class="mb-7">
    <template #start>
      <InputGroup>
        <InputText placeholder="Buscar" />
        <Button icon="pi pi-search" />
      </InputGroup>
    </template>
    <template #end>
      <Button label="Nuevo" icon="pi pi-plus" @click="showDialog.group = true" />
    </template>
  </Toolbar>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div v-for="(group, index) in groups" :key="index" class="card mb-0!">
      <div class="flex items-center justify-between">
        <p class="text-xl font-medium mb-0!">
          {{ group.name }}
        </p>
        <div class="flex gap-2">
          <Button
            icon="pi pi-id-card"
            severity="contrast"
            size="small"
            rounded
            raised
            text
            @click="openMembershipDialog(group.memberships)"
          />
          <Button
            asChild
            v-if="group.user.id === user.id"
            v-slot="slotProps"
            class="flex gap-2"
            size="small"
            rounded
            raised
            text
          >
            <RouterLink :class="slotProps.class" :to="{ name: 'group', params: { id: group.id } }">
              <i class="pi pi-pencil" />
            </RouterLink>
          </Button>
          <Button
            v-if="group.user.id === user.id"
            class="flex gap-2"
            icon="pi pi-times"
            severity="danger"
            size="small"
            rounded
            raised
            text
            @click="openConfirmDialog(group.id)"
          />
        </div>
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
    </div>
  </div>
  <GroupDialog v-model:visible="showDialog.group" @onSubmit="handleCreate" />
  <MembershipDialog
    v-model:visible="showDialog.membership"
    :initialValues="{ budget: membershipSelected.budget }"
    @submit="handleUpdateMembership"
  />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useConfirm } from 'primevue'
import type { Group, GroupPayload } from '@/types/group'
import type { Membership, MembershipPayload } from '@/types/membership'
import GroupDialog from '@/components/groups/GroupDialog.vue'
import MembershipDialog from '@/components/groups/MembershipDialog.vue'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import { getErrorMessage } from '@/services/axios'
import { groupsService } from '@/services/groups.service'
import { membershipsService } from '@/services/memberships.service'
import { useNotification } from '@/composables/useNotification'
import { useAuthStore } from '@/stores/auth.store'

const groups = ref<Group[]>(await groupsService.getAll())
const showDialog = reactive({ group: false, membership: false })
const membershipSelected = reactive<{ id: string | null; budget: number | null }>({
  id: null,
  budget: null,
})

const { showToast } = useNotification()
const { user } = useAuthStore()
const confirm = useConfirm()

const openConfirmDialog = (id: string) => {
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
  membershipSelected.budget = membership.budget

  showDialog.membership = true
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
