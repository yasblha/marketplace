<template>
  <div>
    <h2>Subscribe to Alerts</h2>
    <form @submit.prevent="subscribe">
      <input type="email" v-model="email" placeholder="Enter your email" required>
      <select v-model="alertType">
        <option value="newProduct">New Product</option>
        <option value="priceChange">Price Change</option>
        <option value="promotion">Promotion</option>
      </select>
      <button type="submit">Subscribe</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import apiClient from '@/services/api';

const email = ref('');
const alertType = ref('newProduct');

const subscribe = async () => {
  try {
    const response = await apiClient.post('/alerts/subscribe', { email: email.value, alertType: alertType.value, userToken: 'dummyTokenForTesting' });
    alert(`Subscription successful: ${response.data.message}`);
  } catch (error: any) {
    console.error(error);

    if (error.response && error.response.data && error.response.data.message) {
      alert(`Subscription failed: ${error.response.data.message}`);
    } else if (error instanceof Error) {
      alert(`Subscription failed: ${error.message}`);
    } else {
      alert('Subscription failed: An unknown error occurred.');
    }
  }
};
</script>
