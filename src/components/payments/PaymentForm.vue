<template>
  <Form
    ref="formRef"
    v-slot="$form"
    :resolver="paymentResolver"
    :initialValues="{
      closedAt: new Date(),
      group: '',
      payer: '',
      debt: null,
      amount: null,
      method: '',
      description: '',
    }"
    @submit="onSubmit"
    class="md:max-w-sm"
  >
    <div class="card p-5! flex flex-col gap-4 mb-4!">
      <div class="flex flex-col gap-2">
        <label for="group">Grupo</label>
        <Select
          id="group"
          name="group"
          :options="groups"
          @change="showMore = false"
          optionLabel="name"
          optionValue="id"
          placeholder="Selecciona grupo"
          fluid
        />
        <Message v-if="$form.group?.invalid" severity="error" variant="simple">
          {{ $form.group.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="payer">Miembro</label>
        <Select
          id="payer"
          name="payer"
          :options="members"
          @change="showMore = false"
          optionLabel="firstName"
          optionValue="id"
          placeholder="Selecciona miembro"
          fluid
        />
        <Message v-if="$form.payer?.invalid" severity="error" variant="simple">
          {{ $form.payer.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="closedAt">Fecha de cierre</label>
        <DatePicker
          id="closedAt"
          name="closedAt"
          v-model="closedAtValue"
          @update:modelValue="showMore = false"
          dateFormat="dd/mm/yy"
          :maxDate="new Date()"
          :manualInput="false"
          showIcon
          showButtonBar
          placeholder="Selecciona fecha"
          fluid
        />
        <Message v-if="$form.closedAt?.invalid" severity="error" variant="simple">
          {{ $form.closedAt.error?.message }}
        </Message>
      </div>
      <div class="flex items-center justify-between">
        <Button
          v-if="!showMore"
          type="button"
          label="Regresar"
          severity="secondary"
          @click="router.push({ name: 'payments' })"
        />
        <Button
          type="button"
          label="Limpiar"
          icon="pi pi-eraser"
          severity="info"
          @click="handleClean"
        />
        <Button type="button" label="Buscar" icon="pi pi-search" @click="handleSearch" />
      </div>
    </div>
    <div v-show="showMore" class="card p-5! flex flex-col gap-4">
      <div class="flex gap-3">
        <div class="flex flex-col gap-2">
          <label for="debt">Deuda</label>
          <InputGroup>
            <InputGroupAddon>S/</InputGroupAddon>
            <InputNumber
              id="debt"
              name="debt"
              :minFractionDigits="2"
              locale="en-US"
              placeholder="Monto"
              disabled
              fluid
            />
          </InputGroup>
        </div>
        <div class="flex flex-col gap-2">
          <label for="amount">Pago</label>
          <InputGroup>
            <InputGroupAddon>S/</InputGroupAddon>
            <InputNumber
              id="amount"
              name="amount"
              :maxFractionDigits="2"
              locale="en-US"
              placeholder="Monto"
              fluid
            />
          </InputGroup>
          <Message v-if="$form.amount?.invalid" severity="error" variant="simple">
            {{ $form.amount.error?.message }}
          </Message>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label for="method">Método</label>
        <Select
          id="method"
          name="method"
          :options="payMethods"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona método"
          fluid
        />
        <Message v-if="$form.method?.invalid" severity="error" variant="simple">
          {{ $form.method.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="description">Descripción</label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe el pago"
          :autoResize="true"
          rows="3"
          fluid
        />
        <Message v-if="$form.description?.invalid" severity="error" variant="simple">
          {{ $form.description.error?.message }}
        </Message>
      </div>
      <div class="flex items-center justify-between">
        <Button
          type="button"
          label="Regresar"
          severity="secondary"
          @click="router.push({ name: 'payments' })"
        />
        <Button type="submit" label="Verificar" icon="pi pi-arrow-up-right" iconPos="right" />
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormSubmitEvent } from '@primevue/forms'
import type { Group } from '@/types/group'
import type { PaymentPayload } from '@/types/payment'
import { groupsService } from '@/services/groups.service'
import { expensesService } from '@/services/expenses.service'
import { paymentResolver } from '@/resolvers/payment.resolver'
import { useGroupMembers } from '@/composables/useGroupMembers'
import { useNotification } from '@/composables/useNotification'
import { payMethods } from '@/utils'
import router from '@/router'

const emit = defineEmits<{
  (e: 'submit', values: PaymentPayload, preview: PaymentPayload): void
}>()

const showMore = ref(false)
const formRef = ref<FormInstance | null>(null)
const groups = reactive<Group[]>(await groupsService.getAll())
const closedAtValue = ref(new Date())

const members = useGroupMembers(() => formRef.value?.states.group?.value)
const { showToast } = useNotification()

const onSubmit = (form: FormSubmitEvent) => {
  if (!form.valid) return
  const values = form.values as PaymentPayload
  emit('submit', values, getPreview(values))
}

const getPreview = (values: PaymentPayload) => {
  const group = groups.find((group) => group.id === values.group)
  const member = members.value.find((member) => member.id === values.payer)

  return {
    ...values,
    group: group?.name ?? '',
    payer: member?.firstName ?? '',
  }
}

const handleClean = () => {
  const form = formRef.value

  if (!form) return

  closedAtValue.value = new Date()
  form.reset()

  showMore.value = false
}

const handleSearch = async () => {
  const form = formRef.value

  if (!form) return

  const payer = form.states.payer?.value
  const group = form.states.group?.value
  const closedAt = form.states.closedAt?.value

  if (!payer || !group || !closedAt) return

  const sum = await expensesService.getDebts({ user: payer, group, closedAt })

  if (sum) {
    showMore.value = true
    form.setFieldValue('debt', sum)
    return
  }

  showMore.value = false

  showToast({ severity: 'warn', summary: 'No se encontraron deudas' })
}
</script>
