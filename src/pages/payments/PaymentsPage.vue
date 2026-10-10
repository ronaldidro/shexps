<template>
  <AppBreadcrumb :items="[{ label: 'Pagos' }]" />
  <Toolbar class="mb-7">
    <template #start>
      <SearchField v-model="search" @search="handleSearch" />
    </template>
    <template #end>
      <Button label="Nuevo" icon="pi pi-plus" @click="router.push({ name: 'new-payment' })" />
    </template>
  </Toolbar>
  <div class="card p-1!">
    <div ref="el" class="overflow-y-auto h-dvh">
      <div
        v-for="(payment, index) in payments"
        :key="payment.id"
        class="mx-6 py-6"
        :class="{ 'border-t border-surface': index !== 0 }"
      >
        <PaymentItem :payment="payment" @toggle="toggleMenu" />
      </div>
      <p v-if="loading" class="text-center pt-5">
        <ProgressSpinner style="width: 50px; height: 50px" />
      </p>
      <p v-else-if="!payments.length" class="text-center text-lg pt-5">
        <i class="pi pi-info-circle pr-2" />
        No se encontraron pagos
      </p>
      <ScrollTop
        target="parent"
        icon="pi pi-arrow-up"
        :buttonProps="{ severity: 'contrast', raised: true, rounded: true }"
      />
    </div>
  </div>
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
    <template #item="{ item, props }">
      <div @click.capture.stop="handleMenuClick($event, item)">
        <a v-bind="props.action" class="p-menu-item-link">
          <span class="p-menu-item-icon" :class="item.icon" />
          <span class="p-menu-item-label">{{ item.label }}</span>
        </a>
      </div>
    </template>
  </Menu>
  <PaymentDrawer v-model:visible="showDrawer" :payment />
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useConfirm } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import type { Payment } from '@/types/payment'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import PaymentDrawer from '@/components/payments/PaymentDrawer.vue'
import PaymentItem from '@/components/payments/PaymentItem.vue'
import SearchField from '@/components/SearchField.vue'
import { useScrollPagination } from '@/composables/useScrollPagination'
import { useNotification } from '@/composables/useNotification'
import { useReport } from '@/composables/useReport'
import { paymentsService } from '@/services/payments.service'
import { getError, getErrorMessage } from '@/services/axios'
import { useAuthStore } from '@/stores/auth.store'
import { HTTP_STATUS_CODE } from '@/utils'
import router from '@/router'

const el = useTemplateRef('el')
const route = useRoute()

const payment = ref<Payment | null>(null)
const showDrawer = ref(false)
const search = ref('')
const menu = ref()

const confirm = useConfirm()
const { user } = useAuthStore()
const { showToast } = useNotification()
const { handleReport, reporting } = useReport(paymentsService.getReport)

const {
  items: payments,
  loading,
  reload,
  setFilters,
} = useScrollPagination<Payment>({ el, fetcher: paymentsService.getAll })

const items = computed(() => {
  const selected = payment.value

  if (!selected) return []

  return [
    {
      label: 'Reporte',
      icon: reporting.value ? 'pi pi-fw pi-spinner pi-spin' : 'pi pi-fw pi-file-pdf',
      disabled: reporting.value,
      command: () => handleReport(selected.id),
    },
    {
      label: 'Ver',
      icon: 'pi pi-fw pi-eye',
      command: () => openDrawer(selected.id),
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-fw pi-times',
      visible: selected.user.id === user.id,
      command: () => openDeleteDialog(selected.id),
    },
  ]
})

const toggleMenu = (event: Event, selected: Payment) => {
  payment.value = selected
  menu.value.toggle(event)
}

const handleMenuClick = async (event: Event, item: MenuItem) => {
  if (item.disabled) return
  if (item.command) await item.command({ originalEvent: event, item })
  menu.value?.hide()
}

const openDrawer = async (id: string) => {
  try {
    payment.value = await paymentsService.get(id)

    if (route.params.id !== id) router.replace({ name: 'payments', params: { id } })

    showDrawer.value = true
  } catch (err) {
    router.replace({ name: 'payments' })

    const error = getError(err)

    if (error && error.status === HTTP_STATUS_CODE.NOT_FOUND) {
      showToast({ severity: 'warn', summary: 'Pago no encontrado' })
      return
    }

    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}

const handleSearch = async (value: string) => {
  search.value = value
  await setFilters({ search: value })
}

const openDeleteDialog = (id: string) => {
  confirm.require({
    header: 'Eliminar pago',
    message: '¿Está seguro de que desea continuar?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'No', severity: 'secondary', icon: 'pi pi-times', text: true },
    acceptProps: { label: 'Sí', severity: 'danger', icon: 'pi pi-check', outlined: true },
    accept: () => handleDelete(id),
  })
}

const handleDelete = async (id: string) => {
  try {
    await paymentsService.remove(id)

    showToast({ severity: 'success', summary: 'Pago eliminado correctamente' })

    await reload()
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}

watch(
  () => route.params.id,
  async (id) => {
    if (!id) return
    await nextTick()
    openDrawer(id as string)
  },
  { immediate: true },
)

watch(showDrawer, (isVisible) => {
  if (!isVisible && route.params.id) {
    payment.value = null
    router.replace({ name: 'payments' })
  }
})
</script>
