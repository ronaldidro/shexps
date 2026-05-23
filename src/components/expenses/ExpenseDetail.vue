<template>
  <div class="flex items-center justify-between mb-2">
    <span>Detalle</span>
    <Button
      type="button"
      icon="pi pi-plus"
      size="small"
      rounded
      @click="push({ user: '', amount: null })"
    />
  </div>
  <div
    v-for="(detail, index) in fields"
    :key="detail.key"
    class="flex items-start gap-2"
  >
    <Button
      type="button"
      icon="pi pi-times"
      severity="danger"
      size="small"
      rounded
      class="mt-0.5"
      @click="remove(index)"
    />
    <div class="flex flex-col gap-2 min-w-44">
      <Field :name="`details.${index}.user`" v-slot="{ field, errorMessage }">
        <Select
          :modelValue="field.value"
          @update:modelValue="field.onChange"
          :options="members"
          optionLabel="fullName"
          optionValue="id"
          placeholder="Miembro"
        />
        <Message v-if="errorMessage" severity="error" variant="simple">
          {{ errorMessage }}
        </Message>
      </Field>
    </div>
    <div class="flex flex-col gap-2 max-w-30">
      <Field :name="`details.${index}.amount`" v-slot="{ field, errorMessage }">
        <InputGroup>
          <InputGroupAddon>S/</InputGroupAddon>
          <InputNumber
            :modelValue="field.value"
            @update:modelValue="field.onChange"
            :minFractionDigits="2"
            locale="en-US"
            placeholder="Monto"
            disabled
            fluid
          />
        </InputGroup>
        <Message v-if="errorMessage" severity="error" variant="simple">
          {{ errorMessage }}
        </Message>
      </Field>
    </div>
  </div>
  <Message v-if="errors.details" severity="error" variant="simple">
    {{ errors.details }}
  </Message>
</template>

<script setup lang="ts">
import { Field, useFieldArray, type FormErrors } from "vee-validate";
import type { ExpensePayload } from "@/types/expense";
import type { User } from "@/types/user";

defineProps<{ members: User[]; errors: FormErrors<ExpensePayload> }>();

const { fields, push, remove } = useFieldArray("details");
</script>
