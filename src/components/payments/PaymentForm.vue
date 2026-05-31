<template>
  <Form
    ref="formRef"
    v-slot="$form"
    :resolver="paymentResolver"
    :initialValues="{
      group: '',
      payer: '',
      debt: null,
      amount: null,
      method: '',
      description: '',
    }"
    @submit="submit"
    class="flex flex-col gap-4"
  >
    <div class="flex flex-col gap-2">
      <label for="group">Grupo</label>
      <Select
        id="group"
        name="group"
        :options="groups"
        @change="handleGroupChange"
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
        @change="handlePayerChange"
        optionLabel="fullName"
        optionValue="id"
        placeholder="Selecciona miembro"
        fluid
      />
      <Message v-if="$form.payer?.invalid" severity="error" variant="simple">
        {{ $form.payer.error?.message }}
      </Message>
    </div>
    <div v-show="showMore" class="flex flex-col gap-4">
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
          <Message
            v-if="$form.amount?.invalid"
            severity="error"
            variant="simple"
          >
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
        <Message
          v-if="$form.description?.invalid"
          severity="error"
          variant="simple"
        >
          {{ $form.description.error?.message }}
        </Message>
      </div>
      <Button
        type="submit"
        label="Guardar"
        icon="pi pi-check"
        class="ml-auto"
      />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormInstance, FormSubmitEvent } from "@primevue/forms";
import { type SelectChangeEvent } from "primevue";
import type { Group } from "@/types/group";
import { groupsService } from "@/services/groups.service";
import { expensesService } from "@/services/expenses.service";
import { paymentResolver } from "@/resolvers/payment.resolver";
import { useGroupMembers } from "@/composables/useGroupMembers";
import { useNotification } from "@/composables/useNotification";
import { payMethods } from "@/utils";
import type { PaymentPayload } from "@/types/payment";

const emit = defineEmits<{
  (e: "submit", values: PaymentPayload): void;
}>();

const showMore = ref(false);
const formRef = ref<FormInstance | null>(null);
const groups = reactive<Group[]>(await groupsService.getAll());

const members = useGroupMembers(() => formRef.value?.states.group?.value);
const { showToast } = useNotification();

const submit = (form: FormSubmitEvent) => {
  if (!form.valid) return;
  emit("submit", form.values as PaymentPayload);
};

const handleGroupChange = () => {
  formRef.value?.setFieldValue("payer", "");
  formRef.value?.setFieldValue("debt", null);
  showMore.value = false;
};

const handlePayerChange = async (e: SelectChangeEvent) => {
  const sum = await expensesService.getDetailsSum({
    debtor: e.value,
    group: formRef.value?.states.group?.value,
  });

  if (sum) {
    showMore.value = true;
    formRef.value?.setFieldValue("debt", sum);
    return;
  }

  showMore.value = false;

  showToast({ severity: "warn", summary: "No se encontraron deudas" });
};
</script>
