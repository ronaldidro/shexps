<template>
  <Dialog
    :visible="visible"
    @update:visible="close"
    :style="{ width: '300px' }"
    header="Membresía"
    :modal="true"
  >
    <form @submit="onSubmit" class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="budget">Presupuesto</label>
        <Field id="budget" name="budget" v-slot="{ field, handleChange }">
          <InputGroup>
            <InputGroupAddon>S/</InputGroupAddon>
            <InputNumber
              :modelValue="field.value"
              @update:modelValue="handleChange"
              :maxFractionDigits="2"
              locale="en-US"
              placeholder="Monto"
              fluid
            />
          </InputGroup>
        </Field>
      </div>
      <div class="flex items-center justify-between">
        <Button type="button" label="Cancelar" severity="secondary" @click="close" />
        <Button type="submit" label="Guardar" icon="pi pi-check" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { Field, useForm } from 'vee-validate'
import type { MembershipPayload } from '@/types/membership'

const props = defineProps<{ visible: boolean; initialValues: { budget: number | null } }>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'submit', values: MembershipPayload): void
}>()

const { handleSubmit, resetForm } = useForm()

watch(
  () => props.initialValues,
  (newValues) => resetForm({ values: newValues }),
  { deep: true },
)

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
  emit('update:visible', false)
})

const close = () => emit('update:visible', false)
</script>
