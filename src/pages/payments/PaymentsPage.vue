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
  <FilterPanel
    @submit="handleFilters"
    @clear="handleClear"
    :total="data?.meta?.total"
    :showAuthUser="true"
  />
  <div v-if="data?.items.length" class="card p-1!">
    <div
      v-for="(payment, index) in data?.items"
      :key="payment.id"
      class="mx-6 py-6"
      :class="{ 'border-t border-surface': index !== 0 }"
    >
      <PaymentItem :payment="payment" @toggle="toggleMenu" />
    </div>
  </div>
  <p v-if="!isLoading && !data?.items.length" class="text-center text-lg">
    <i class="pi pi-info-circle pr-2" />
    No se encontraron pagos
  </p>
  <p v-if="isLoading || isFetchingNextPage" class="text-center">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </p>
  <ScrollTop
    icon="pi pi-arrow-up"
    :buttonProps="{ severity: 'contrast', raised: true, rounded: true, class: 'mb-20 md:mb-0' }"
  />
  <div ref="sentinel"></div>
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
import { computed, nextTick, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useConfirm } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import type { QueryParams } from '@/types/pagination'
import type { Payment } from '@/types/payment'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import PaymentDrawer from '@/components/payments/PaymentDrawer.vue'
import PaymentItem from '@/components/payments/PaymentItem.vue'
import SearchField from '@/components/SearchField.vue'
import { usePaymentQuery } from '@/composables/query/usePaymentQuery'
import { useNotification } from '@/composables/useNotification'
import { useReport } from '@/composables/useReport'
import { paymentsService } from '@/services/payments.service'
import { getErrorMessage } from '@/services/axios'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const route = useRoute()
const confirm = useConfirm()
const { user } = useAuthStore()
const { showToast } = useNotification()
const { handleReport, reporting } = useReport(paymentsService.getReport)
const { findAll, findOne, remove } = usePaymentQuery()

const sentinel = ref(null)
const payment = ref<Payment | null>(null)
const showDrawer = ref(false)
const search = ref('')
const menu = ref()
const filters = ref<Partial<QueryParams>>({})

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = findAll(filters)
const { mutate: findPayment } = findOne()
const { mutate: removePayment } = remove()

useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) fetchNextPage()
})

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

const openDrawer = (id: string) =>
  findPayment(id, {
    onSuccess: (data) => {
      payment.value = data
      showDrawer.value = true
    },
    onError: (err) => {
      router.replace({ name: 'payments' })
      showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
    },
  })

const handleSearch = (value: string) => {
  search.value = value
  filters.value = { search: search.value }
}

const handleFilters = (values: QueryParams) => (filters.value = values)

const handleClear = () => (filters.value = {})

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

const handleDelete = (id: string) =>
  removePayment(id, {
    onSuccess: () => {
      showToast({ severity: 'success', summary: 'Pago eliminado correctamente' })
      handleClear()
    },
  })

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
