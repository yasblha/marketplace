<template>
  <div class="payment-success">
    <h1>Payment Successful</h1>
    <p>Your payment was successful! Thank you for your purchase.</p>

    <div v-if="order" class="order-summary">
      <h2>Order #{{ order.id }}</h2>
      <p>Date: {{ new Date(order.dateOrder).toLocaleDateString() }}</p>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.OrderDetails" :key="item.productName">
            <td>{{ item.productName }}</td>
            <td>{{ item.unitPrice }}</td>
            <td>{{ item.quantity }}</td>
          </tr>
        </tbody>
      </table>
      <h3>Total: {{ order.totalAmount }}</h3>
      <button @click="generateInvoice">Print Invoice</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore, type Order } from '@/stores/Commande';
import { useCartStore } from '@/stores/panier';
import { printInvoice } from '@/utils/invoice';
import { OrderStatus } from '@/types/orderStatus'

const router = useRouter();
const orderStore = useOrderStore();
const cart = useCartStore();
const order = ref<Order | null>(null);

const generateInvoice = () => {
  if (order.value) {
    printInvoice(order.value);
  }
};

onMounted(async () => {
  const stored = localStorage.getItem('currentOrderId');
  const routeId = router.currentRoute.value.query.orderId as string;
  const id = stored || routeId;
  if (id) {
    const fetched = await orderStore.fetchOrderById(Number(id));
    if (fetched) {
      order.value = fetched;
      await orderStore.updateOrder(fetched.id, { statusOrder: OrderStatus.Paid });
      localStorage.removeItem('currentOrderId');
      await cart.clear();
      cart.clearSnapshot();
    }
  }
});
</script>

<style scoped>
.payment-success {
  padding: 20px;
  text-align: center;
}

.order-summary {
  margin-top: 20px;
  display: inline-block;
  text-align: left;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
}

th {
  background: #f2f2f2;
}

button {
  padding: 10px 20px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>