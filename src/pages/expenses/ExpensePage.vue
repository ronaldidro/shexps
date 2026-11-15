<template>
  <AppBreadcrumb :items="[{ label: 'Gastos', route: '/expenses' }, { label: 'Nuevo' }]" />
  <div class="card p-5! md:max-w-sm">
    <Stepper v-model:value="activeStep" linear class="basis-200">
      <StepList>
        <Step value="1">Datos</Step>
        <Step value="2">Resumen</Step>
      </StepList>
      <StepPanels>
        <StepPanel value="1">
          <ExpenseForm @submit="onSubmit" :initialData="queryValues" />
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
          <ExpensePreview v-if="expense" :expense="expense.preview" />
          <div class="flex pt-5 justify-between">
            <Button
              label="Regresar"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('1')"
            />
            <Button label="Guardar" icon="pi pi-check" :loading="isPending" @click="save" />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { AuthUser } from '@/types/auth'
import type { ExpensePayload } from '@/types/expense'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import ExpenseForm from '@/components/expenses/ExpenseForm.vue'
import ExpensePreview from '@/components/previews/ExpensePreview.vue'
import { useNotification } from '@/composables/useNotification'
import { useExpenseQuery } from '@/composables/query/useExpenseQuery'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const { showToast } = useNotification()
const { user } = useAuthStore()
const { create } = useExpenseQuery()
const route = useRoute()

const { mutate: createExpense, isPending } = create()

const activeStep = ref('1')
const expense = ref<{ payload: ExpensePayload; preview: ExpensePayload & { user: AuthUser } }>()

const queryValues = computed(() => {
  return {
    description: (route.query.description as string) || '',
    amount: route.query.amount ? Number(route.query.amount) : null,
  }
})

const onSubmit = (payload: ExpensePayload, preview: ExpensePayload) => {
  expense.value = { payload, preview: { ...preview, user } }
  activeStep.value = '2'
}

const save = async () => {
  if (!expense.value) return

  createExpense(expense.value.payload, {
    onSuccess: () => {
      showToast({ severity: 'success', summary: 'Gasto registrado correctamente' })
      router.push({ name: 'expenses' })
    },
  })
}
</script>
