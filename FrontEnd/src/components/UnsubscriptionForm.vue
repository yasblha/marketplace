<template>
  <div>
    <h2>Unsubscribe from Alerts</h2>
    <form @submit.prevent="unsubscribe">
      <input type="email" v-model="email" placeholder="Enter your email" required>
      <select v-model="alertType">
        <option value="newProduct">New Product</option>
        <option value="priceChange">Price Change</option>
        <option value="promotion">Promotion</option>
      </select>
      <button type="submit">Unsubscribe</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import apiClient from '@/services/api';

const email = ref<string>('');
const alertType = ref<string>('newProduct');

const unsubscribe = async () => {
  try {
    const response = await apiClient.post('/alerts/unsubscribe', { email: email.value, alertType: alertType.value });
    alert(`Unsubscription successful: ${response.data.message}`);
  } catch (error: any) {
    console.error(error);

    if (error.response && error.response.data && error.response.data.message) {
      alert(`Unsubscription failed: ${error.response.data.message}`);
    } else if (error instanceof Error) {
      alert(`Unsubscription failed: ${error.message}`);
    } else {
      alert('Unsubscription failed: An unknown error occurred.');
    }
  }
};
</script>
