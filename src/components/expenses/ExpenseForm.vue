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
          showIcon
          showButtonBar
          placeholder="Selecciona la fecha"
          fluid
        />
        <Message v-if="errorMessage" severity="error" variant="simple">
          {{ errorMessage }}
        </Message>
      </Field>
    </div>
    <div class="flex flex-col gap-2">
      <label for="description">Descripción</label>
      <Field
        id="description"
        name="description"
        v-slot="{ field, errorMessage }"
      >
        <InputText v-bind="field" placeholder="Describe el gasto" fluid />
        <Message v-if="errorMessage" severity="error" variant="simple">
          {{ errorMessage }}
        </Message>
      </Field>
    </div>
    <div class="flex flex-col gap-2">
      <label for="amount">Monto total</label>
      <Field id="amount" name="amount" v-slot="{ field, errorMessage }">
        <InputGroup>
          <InputGroupAddon>S/</InputGroupAddon>
          <InputNumber
            :modelValue="field.value"
            @update:modelValue="field.onChange"
            :maxFractionDigits="2"
            placeholder="Ingresa el monto total"
            fluid
          />
        </InputGroup>
        <Message v-if="errorMessage" severity="error" variant="simple">
          {{ errorMessage }}
        </Message>
      </Field>
    </div>
    <div class="flex flex-col gap-2">
      <ExpenseDetail :members :errors />
    </div>
    <Button type="submit" label="Guardar" icon="pi pi-check" class="ml-auto" />
  </form>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { Field, useForm } from "vee-validate";
import { expenseSchema } from "@/schemas/expense.schema";
import type { Group } from "@/types/group";
import type { User } from "@/types/user";
import { groupsService } from "@/services/groups.service";
import { membershipsService } from "@/services/memberships.service";
import type { ExpensePayload } from "@/types/expense";
import ExpenseDetail from "./ExpenseDetail.vue";

const emit = defineEmits<{ (e: "submit", payload: ExpensePayload): void }>();

const { handleSubmit, errors, values } = useForm({
  validationSchema: expenseSchema,
  initialValues: {
    group: "",
    expensedAt: "",
    description: "",
    amount: null,
    details: [{ user: "", amount: null }],
  },
});

const groups = ref<Group[]>([]);
const members = ref<User[]>([]);

const onSubmit = handleSubmit((values) => emit("submit", values));

watch(
  () => values.group,
  async (selectedGroup) => {
    const memberships = await membershipsService.getAll({
      group: selectedGroup,
    });
    members.value = memberships.map((memberships) => memberships.user);
  },
);

onMounted(async () => (groups.value = await groupsService.getAll()));
</script>
