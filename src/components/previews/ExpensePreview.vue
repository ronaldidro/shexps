<template>
  <div class="flex items-center justify-between">
    <article class="flex items-center gap-2">
      <i class="pi pi-address-book" />
      <span class="text-lg">Grupo</span>
    </article>
    <span class="text-muted-color font-medium">{{ expense.group }}</span>
  </div>
  <div class="flex items-center justify-between">
    <article class="flex items-center gap-2">
      <i class="pi pi-calendar" />
      <span class="text-lg">Fecha</span>
    </article>
    <span class="text-muted-color font-medium">
      {{ new Date(expense.expensedAt).toLocaleDateString() }}
    </span>
  </div>
  <article class="flex items-center gap-2">
    <i class="pi pi-list-check" />
    <span class="text-lg">Descripción</span>
  </article>
  <span class="text-muted-color font-medium">{{ expense.description }}</span>
  <article class="flex items-center gap-2">
    <i class="pi pi-users" />
    <span class="text-lg">Miembros</span>
  </article>
  <div
    v-for="(detail, index) in expense.details"
    :key="index"
    class="flex items-center justify-between"
  >
    <article class="flex items-center gap-2 ml-6">
      <i class="pi pi-user" />
      <span>{{ detail.user }}</span>
    </article>
    <span class="text-muted-color font-medium">
      S/{{ detail.amount.toFixed(2) }}
    </span>
  </div>
  <div v-if="expense.splitted" class="flex items-center justify-between">
    <article class="flex items-center gap-2 ml-6">
      <i class="pi pi pi-user" />
      <span>{{ expense.user.name }}</span>
    </article>
    <span class="text-muted-color font-medium">
      S/{{ expense.details[0].amount.toFixed(2) }}
    </span>
  </div>
  <div class="flex items-center justify-between">
    <article class="flex items-center gap-2">
      <i class="pi pi-money-bill" />
      <span class="text-lg">Total</span>
    </article>
    <span class="text-muted-color font-medium">
      S/{{ expense.amount.toFixed(2) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { AuthUser } from "@/types/auth";
import type { ExpensePayload } from "@/types/expense";

defineProps<{ expense: ExpensePayload & { user: AuthUser } }>();
</script>
