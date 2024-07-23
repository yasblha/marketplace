<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="status_order">Status</label>
      <input id="status_order" v-model="form.status_order" required />
    </div>
    <div>
      <label for="total_amount">Total Amount</label>
      <input id="total_amount" v-model.number="form.total_amount" type="number" required />
    </div>
    <div>
      <label for="product_ids">Product IDs</label>
      <input id="product_ids" v-model="form.product_ids" required />
    </div>
    <button type="submit">{{ initialData ? 'Update' : 'Add' }} Order</button>
  </form>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import type { Order } from '@/stores/Commande';

const props = defineProps<{
  initialData?: Partial<Order> | null;
}>();

const emit = defineEmits(['order-added', 'order-updated']);

const form = ref({
  status_order: '',
  total_amount: 0,
  product_ids: [] as number[],
  userId: 1,
});

watch(
    () => props.initialData,
    (newData) => {
      if (newData) {
        form.value = {
          status_order: newData.status_order || '',
          total_amount: newData.total_amount || 0,
          product_ids: newData.product_ids || [],
          userId: newData.userId || 1,
        };
      }
    },
    { immediate: true, deep: true }
);

const handleSubmit = async () => {
  if (props.initialData) {
    await emit('order-updated', form.value);
  } else {
    await emit('order-added', form.value);
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: bold;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
