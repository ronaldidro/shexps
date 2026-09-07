<template>
  <Panel header="Filtros" toggleable collapsed class="mb-5">
    <Form ref="formRef" v-slot="$form" :resolver="filterResolver" @submit="onSubmit">
      <div class="flex flex-col md:flex-row gap-4 pb-4">
        <div class="flex flex-col flex-1 gap-2">
          <label for="group">Grupo</label>
          <Select
            id="group"
            name="group"
            :options="groups"
            optionLabel="name"
            optionValue="id"
            placeholder="Selecciona grupo"
            fluid
          />
        </div>
        <div class="flex flex-col flex-1 gap-2">
          <label for="user">Miembro</label>
          <Select
            id="user"
            name="user"
            :options="members"
            optionLabel="firstName"
            optionValue="id"
            placeholder="Selecciona miembro"
            fluid
          />
        </div>
        <div class="flex flex-col flex-1 gap-2">
          <label for="range">Rango de fechas</label>
          <DatePicker
            id="range"
            name="range"
            dateFormat="dd/mm/yy"
            selectionMode="range"
            :maxDate="new Date()"
            :manualInput="false"
            hideOnRangeSelection
            showIcon
            showButtonBar
            placeholder="Selecciona fechas"
            fluid
          />
          <Message v-if="$form.range?.invalid" severity="error" variant="simple">
            {{ $form.range.error?.message }}
          </Message>
        </div>
      </div>
      <div class="flex justify-between md:justify-end gap-1 md:gap-2">
        <Button
          type="button"
          label="Reporte"
          severity="secondary"
          icon="pi pi-file-pdf"
          @click="onReport"
          :loading="reporting"
        />
        <Button type="submit" label="Filtrar" icon="pi pi-filter" />
        <SplitButton
          label="Limpiar"
          severity="info"
          icon="pi pi-eraser"
          @click="onClear"
          :model="buttonItems"
        />
      </div>
    </Form>
  </Panel>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Group } from '@/types/group'
import type { QueryParams } from '@/types/pagination'
import type { FormInstance, FormSubmitEvent } from '@primevue/forms'
import { groupsService } from '@/services/groups.service'
import { useGroupMembers } from '@/composables/useGroupMembers'
import { filterResolver } from '@/resolvers/filter.resolver'

const props = withDefaults(defineProps<{ reporting: boolean; showAuthUser?: boolean }>(), {
  showAuthUser: false,
})

const emit = defineEmits<{
  (e: 'submit', payload: QueryParams): void
  (e: 'report', payload: QueryParams): void
  (e: 'delete', payload: QueryParams): void
  (e: 'clear'): void
}>()

const formRef = ref<FormInstance | null>(null)
const groups = reactive<Group[]>(await groupsService.getAll())

const members = useGroupMembers(() => formRef.value?.states.group?.value, props.showAuthUser)

const buttonItems = [{ label: 'Eliminar', icon: 'pi pi-times', command: () => onDelete() }]

const validateForm = async () => {
  const form = formRef.value
  const result = await form?.validate()
  const isEmpty = checkEmptyValues(result?.values)

  return { form, result, isEmpty }
}

const checkEmptyValues = (values: Record<string, unknown>) =>
  Object.values(values).every((value) => !value)

const onSubmit = (form: FormSubmitEvent) => {
  if (!form.valid) return

  const isEmpty = checkEmptyValues(form.values)

  if (isEmpty) return

  emit('submit', form.values as QueryParams)
}

const onReport = async () => {
  const { form, result } = await validateForm()

  if (!form?.valid) return

  emit('report', result?.values as QueryParams)
}

const onClear = async () => {
  const { isEmpty } = await validateForm()

  if (isEmpty) return

  formRef.value?.reset()
  members.value = []

  emit('clear')
}

const onDelete = async () => {
  const { result, isEmpty } = await validateForm()

  if (isEmpty) return

  emit('delete', result?.values as QueryParams)
}
</script>
