<template>
  <AppBreadcrumb :items="[{ label: 'Usuarios' }]" />
  <div class="card p-5!">
    <Toolbar class="mb-4">
      <template #start>
        <Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="openNew" />
        <Button
          label="Borrar"
          icon="pi pi-trash"
          severity="danger"
          variant="outlined"
          @click="openDeleteManyDialog"
          :disabled="!selectedUsers || !selectedUsers.length"
        />
      </template>
      <template #end>
        <Button
          label="Exportar"
          icon="pi pi-download"
          severity="secondary"
          @click="dt.exportCSV()"
        />
      </template>
    </Toolbar>
    <DataTable
      ref="dt"
      dataKey="id"
      v-model:selection="selectedUsers"
      :loading="fetching"
      :value="users"
      :paginator="true"
      :rows="10"
      :filters="filters"
      :rowsPerPageOptions="[5, 10, 25]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} usuarios"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between mb-4">
          <h4 class="m-0!">Gestionar Usuarios</h4>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Buscar" />
          </IconField>
        </div>
      </template>
      <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
      <Column field="firstName" header="Nombres" sortable />
      <Column field="lastName" header="Apellidos" sortable />
      <Column field="email" header="Correo" sortable />
      <Column field="role" header="Rol" sortable>
        <template #body="slotProps">
          {{ USER_ROLE[slotProps.data.role as Role] }}
        </template>
      </Column>
      <Column field="createdAt" header="Fecha creación" sortable />
      <Column header="Acciones" :exportable="false">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            variant="outlined"
            class="mr-2"
            @click="editUser(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            variant="outlined"
            severity="danger"
            @click="openDeleteDialog(slotProps.data?.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
  <UserDialog
    v-model:visible="dialog.visible"
    :header="dialog.header"
    :initialValues="initial"
    :loading="creating || updating"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useConfirm } from 'primevue'
import { FilterMatchMode } from '@primevue/core/api'
import type { Role, User, UserPayload } from '@/types/user'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import UserDialog from '@/components/users/UserDialog.vue'
import { useNotification } from '@/composables/useNotification'
import { useUserQuery } from '@/composables/query/useUserQuery'
import { USER_ROLE } from '@/utils'

const emptyUser: UserPayload = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'guest',
}

const confirm = useConfirm()
const { showToast } = useNotification()
const { read, create, update, remove } = useUserQuery()

const { data: users, isLoading: fetching } = read()
const { mutate: createUser, isPending: creating } = create()
const { mutate: updateUser, isPending: updating } = update()
const { mutate: removeUser } = remove()

const dt = ref()
const selectedUsers = ref<User[]>([])
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } })
const initial = ref<UserPayload>(emptyUser)
const dialog = reactive({ header: '', visible: false })

const openNew = () => {
  dialog.header = 'Nuevo usuario'
  dialog.visible = true
  initial.value = emptyUser
}

const editUser = (user: UserPayload) => {
  dialog.header = 'Editar usuario'
  dialog.visible = true
  initial.value = user
}

const onSubmit = async (values: UserPayload) => {
  const id = initial.value.id

  if (id) {
    updateUser(
      { id, payload: values },
      {
        onSuccess: () => {
          showToast({ severity: 'success', summary: 'Usuario actualizado correctamente' })
          dialog.visible = false
        },
      },
    )
  } else {
    createUser(values, {
      onSuccess: () => {
        showToast({ severity: 'success', summary: 'Usuario registrado correctamente' })
        dialog.visible = false
      },
    })
  }
}

const openDeleteDialog = (id: string) => {
  confirm.require({
    header: 'Eliminar usuario',
    message: '¿Está seguro de que desea continuar?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'No', severity: 'secondary', icon: 'pi pi-times', text: true },
    acceptProps: { label: 'Sí', severity: 'danger', icon: 'pi pi-check', outlined: true },
    accept: () => handleDelete(id),
  })
}

const handleDelete = async (id: string) => {
  removeUser(id, {
    onSuccess: () => showToast({ severity: 'success', summary: 'Usuario eliminado correctamente' }),
  })
}

const openDeleteManyDialog = () => {
  confirm.require({
    header: 'Eliminar usuarios seleccionados',
    message: '¿Está seguro de que desea continuar?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'No', severity: 'secondary', icon: 'pi pi-times', text: true },
    acceptProps: { label: 'Sí', severity: 'danger', icon: 'pi pi-check', outlined: true },
    accept: () => selectedUsers.value.map((user) => console.log('id', user.id)),
  })
}
</script>
