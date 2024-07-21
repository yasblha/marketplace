<template>
  <div class="orders-section">
    <h2>Mes Commandes</h2>
    <div v-for="order in orders" :key="order.id" class="order-card">
      <h3>Commande #{{ order.id }}</h3>
      <p>Date: {{ order.date }}</p>
      <p>Montant: {{ order.amount }}€</p>
      <button @click="viewOrderDetails(order.id)">Voir les détails</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const orders = ref([
  { id: '1', date: '2024-01-01', amount: 100 },
  { id: '2', date: '2024-02-01', amount: 150 },
]);

const viewOrderDetails = (orderId: string) => {
};
</script>

<style scoped>
.orders-section {
  max-width: 600px;
  margin: auto;
}

.order-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.order-card h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.order-card p {
  margin: 5px 0;
}

.order-card button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.order-card button:hover {
  background-color: #1d94d2;
}
</style>