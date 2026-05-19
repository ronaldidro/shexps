<template>
  <AppBreadcrumb
    :items="[
      { label: 'Movimientos' },
      { label: 'Gastos', route: '/expenses' },
      { label: 'Nuevo' },
    ]"
  />
  <div class="card md:max-w-sm">
    <Form
      v-slot="$form"
      :resolver="expenseResolver"
      :initialValues="{ date: '', description: '', amount: null }"
      @submit="onSubmit"
      class="flex flex-col gap-4"
    >
      <div class="flex flex-col gap-2">
        <label for="date">Fecha</label>
        <DatePicker
          name="date"
          dateFormat="dd/mm/yy"
          :maxDate="new Date()"
          showIcon
          showButtonBar
          placeholder="Selecciona la fecha"
          fluid
        />
        <Message v-if="$form.date?.invalid" severity="error" variant="simple">
          {{ $form.date.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="description">Descripción</label>
        <InputText
          id="description"
          name="description"
          type="text"
          placeholder="Describe el gasto"
          fluid
        />
        <Message
          v-if="$form.description?.invalid"
          severity="error"
          variant="simple"
        >
          {{ $form.description.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="amount">Monto</label>
        <InputGroup>
          <InputGroupAddon>S/</InputGroupAddon>
          <InputNumber
            id="amount"
            name="amount"
            :maxFractionDigits="2"
            placeholder="Ingresa el monto"
            fluid
          />
        </InputGroup>
        <Message v-if="$form.amount?.invalid" severity="error" variant="simple">
          {{ $form.amount.error?.message }}
        </Message>
      </div>
      <Button
        type="submit"
        label="Guardar"
        icon="pi pi-check"
        class="ml-auto"
      />
    </Form>
  </div>
</template>

<script setup lang="ts">
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import { expenseResolver } from "@/resolvers/expense.resolver";
import type { FormSubmitEvent } from "@primevue/forms";

const onSubmit = async (form: FormSubmitEvent) => {
  if (form.valid) console.log("form", form);
};
</script>
