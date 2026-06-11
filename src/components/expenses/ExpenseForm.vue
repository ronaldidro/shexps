<template>
  <form @submit="onSubmit" class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label for="group">Grupo</label>
      <Field id="group" name="group" v-slot="{ field, errorMessage }">
        <Select
          :modelValue="field.value"
          @update:modelValue="field.onChange"
          :options="groups"
          optionLabel="name"
          optionValue="id"
          placeholder="Selecciona grupo"
          fluid
        />
        <Message v-if="errorMessage" severity="error" variant="simple">
          {{ errorMessage }}
        </Message>
      </Field>
    </div>
    <div class="flex flex-col gap-2">
      <label for="expensedAt">Fecha</label>
      <Field id="expensedAt" name="expensedAt" v-slot="{ field, errorMessage }">
        <DatePicker
          :modelValue="field.value"
          @update:modelValue="field.onChange"
          dateFormat="dd/mm/yy"
          :maxDate="new Date()"
          :manualInput="false"
          showIcon
          showButtonBar
          placeholder="Selecciona fecha"
          fluid
        />
        <Message v-if="errorMessage" severity="error" variant="simple">
          {{ errorMessage }}
        </Message>
      </Field>
    </div>
    <div class="flex flex-col gap-2">
      <label for="description">Descripción</label>
      <Field id="description" name="description" v-slot="{ field, errorMessage }">
        <Textarea
          v-bind="field"
          placeholder="Describe el gasto"
          :autoResize="true"
          rows="3"
          fluid
        />
        <Message v-if="errorMessage" severity="error" variant="simple">
          {{ errorMessage }}
        </Message>
      </Field>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Field id="splitted" name="splitted" v-slot="{ field }">
          <ToggleSwitch :modelValue="field.value" @update:modelValue="field.onChange" />
        </Field>
        <label for="splitted">Incluirme en gasto</label>
      </div>
      <div class="flex flex-col gap-2 max-w-30">
        <label for="amount">Monto total</label>
        <Field id="amount" name="amount" v-slot="{ field, errorMessage }">
          <InputGroup>
            <InputGroupAddon>S/</InputGroupAddon>
            <InputNumber
              :modelValue="field.value"
              @input="field.onChange($event.value)"
              :maxFractionDigits="2"
              placeholder="Total"
              fluid
            />
          </InputGroup>
          <Message v-if="errorMessage" severity="error" variant="simple">
            {{ errorMessage }}
          </Message>
        </Field>
      </div>
    </div>
    <hr class="my-0!" />
    <div class="flex flex-col gap-2">
      <ExpenseDetail :members :errors />
    </div>
    <div class="flex items-center justify-between">
      <Button
        type="button"
        label="Regresar"
        severity="secondary"
        @click="router.push({ name: 'expenses' })"
      />
      <Button type="submit" label="Verificar" icon="pi pi-arrow-up-right" iconPos="right" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Field, useForm } from 'vee-validate'
import { expenseSchema } from '@/schemas/expense.schema'
import type { Group } from '@/types/group'
import type { ExpensePayload } from '@/types/expense'
import { groupsService } from '@/services/groups.service'
import { useGroupMembers } from '@/composables/useGroupMembers.ts'
import ExpenseDetail from './ExpenseDetail.vue'
import router from '@/router'

const emit = defineEmits<{
  (e: 'submit', payload: ExpensePayload, preview: ExpensePayload): void
}>()

const groups = reactive<Group[]>(await groupsService.getAll())

const { handleSubmit, errors, values, setFieldValue } = useForm({
  validationSchema: expenseSchema,
  initialValues: {
    group: groups[0]?.id,
    expensedAt: new Date(),
    description: '',
    amount: null,
    splitted: false,
    details: [{ user: '', amount: null }],
  },
})

const members = useGroupMembers(() => values.group as string)

const onSubmit = handleSubmit((values) => emit('submit', values, getPreview(values)))

const getPreview = (values: ExpensePayload) => {
  const group = groups.find((group) => group.id === values.group)

  const details = values.details?.map((detail) => {
    const member = members.value.find((member) => member.id === detail.user)
    return { user: member?.firstName ?? '', amount: detail.amount }
  })

  return { ...values, group: group?.name ?? '', details }
}

const splitAmount = () => {
  if (!values.details?.length) return

  let amount

  if (!values.amount) {
    amount = null
  } else {
    const membersCount = values.details.length
    const divisor = values.splitted ? membersCount + 1 : membersCount
    amount = Number((values.amount / divisor).toFixed(2))
  }

  values.details.forEach((_, index) => setFieldValue(`details[${index}].amount`, amount as never))
}

watch([() => values.amount, () => values.splitted, () => values.details?.length], splitAmount)
</script>
