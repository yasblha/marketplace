<template>
  <form @submit.prevent="submitForm">
    <div class="form-group">
      <label for="status">Status</label>
      <select id="status" v-model="formData.status_order" required>
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
    <div class="form-group">
      <label for="totalAmount">Total Amount</label>
      <input type="number" id="totalAmount" v-model="formData.total_amount" required />
    </div>
    <div class="form-group">
      <label for="products">Products</label>
      <textarea id="products" v-model="productsInput" required></textarea>
      <small>Format: productId (quantity), productId (quantity), ...</small>
    </div>
    <button type="submit">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useOrderStore } from '@/stores/Commande';
import { useAuthStore } from '@/stores/user';

interface OrderForm {
  status_order: string;
  total_amount: number;
  products: { productId: string; quantity: number }[];
}

interface OrderDetail {
  productId: string;
  quantity: number;
}

interface OrderCreateData extends OrderForm {
  userId: number;
  statusOrder: string; // Ensure this is included
  totalAmount: number; // Ensure this is included
}

const props = defineProps<{ initialData?: Partial<OrderForm & { id?: number }> }>();
const emit = defineEmits(['order-added', 'order-updated']);

const orderStore = useOrderStore();
const authStore = useAuthStore();

const formData = ref<OrderForm>({
  status_order: '',
  total_amount: 0,
  products: [],
});

const productsInput = ref('');

watch(
    () => props.initialData,
    (newData) => {
      if (newData) {
        formData.value = {
          ...formData.value,
          ...newData,
        };
        productsInput.value = newData.products?.map(p => `${p.productId} (${p.quantity})`).join(', ') || '';
      }
    },
    { immediate: true }
);

const submitForm = async () => {
  const userId = authStore.user?.id;
  if (!userId) {
    console.error('User ID is missing');
    return;
  }

  formData.value.products = parseProductsInput(productsInput.value);

  if (props.initialData?.id) {
    await orderStore.updateOrder(props.initialData.id, formData.value);
    emit('order-updated');
  } else {
    const orderData: OrderCreateData = {
      ...formData.value,
      userId,
      statusOrder: formData.value.status_order,
      totalAmount: formData.value.total_amount
    };
    await orderStore.createOrder(orderData);
    emit('order-added');
  }
};

const parseProductsInput = (input: string): OrderDetail[] => {
  return input.split(',').map(productStr => {
    const [id, quantityStr] = productStr.trim().split(' (');
    const quantity = parseInt(quantityStr);
    return { productId: id.trim(), quantity };
  });
};
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #218838;
}
</style>
