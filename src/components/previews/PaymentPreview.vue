<template>
  <div class="flex items-center justify-between">
    <article class="flex items-center gap-2">
      <i class="pi pi-address-book" />
      <span class="text-lg">Grupo</span>
    </article>
    <span class="text-muted-color font-medium">{{ payment.group }}</span>
  </div>
  <div class="flex items-center justify-between">
    <article class="flex items-center gap-2">
      <i class="pi pi-user-minus" />
      <span class="text-lg">Paga</span>
    </article>
    <span class="text-muted-color font-medium">
      {{ payment.payer }}
    </span>
  </div>
  <div class="flex items-center justify-between">
    <article class="flex items-center gap-2">
      <i class="pi pi-user-plus" />
      <span class="text-lg">Recibe</span>
    </article>
    <span class="text-muted-color font-medium">
      {{ payment.user.name }}
    </span>
  </div>
  <div class="flex items-center justify-between">
    <article class="flex items-center gap-2">
      <i class="pi pi-wallet" />
      <span class="text-lg">Método</span>
    </article>
    <span class="text-muted-color font-medium">
      {{ PAY_DESCRIPTION[payment.method] }}
    </span>
  </div>
  <article class="flex items-center gap-2">
    <i class="pi pi-list-check" />
    <span class="text-lg">Descripción</span>
  </article>
  <span class="text-muted-color font-medium">{{ payment.description }}</span>
  <div class="flex items-center justify-between">
    <article class="flex items-center gap-2">
      <i class="pi pi-money-bill" />
      <span class="text-lg">Deuda</span>
    </article>
    <span class="text-muted-color font-medium"> S/{{ payment.debt.toFixed(2) }} </span>
  </div>
  <div class="flex items-center justify-between">
    <article class="flex items-center gap-2">
      <i class="pi pi-money-bill" />
      <span class="text-lg">Pago</span>
    </article>
    <span class="text-muted-color font-medium"> S/{{ payment.amount.toFixed(2) }} </span>
  </div>
  <div class="flex items-center justify-between">
    <article class="flex items-center gap-2">
      <i class="pi pi-money-bill" />
      <span class="text-lg">Pendiente</span>
    </article>
    <span class="text-muted-color font-medium"> S/{{ payment.remaining.toFixed(2) }} </span>
  </div>
</template>

<script setup lang="ts">
import type { AuthUser } from '@/types/auth'
import type { PaymentPayload } from '@/types/payment'
import { PAY_DESCRIPTION } from '@/utils'

defineProps<{
  payment: PaymentPayload & { remaining: number } & { user: AuthUser }
}>()
</script>
