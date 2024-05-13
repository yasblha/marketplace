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

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const alertType = ref('newProduct');

const subscribe = async () => {
  try {
    const response = await axios.post('/api/subscribe', { email: email.value, alertType: alertType.value });
    alert(`Subscription successful: ${response.data.message}`);
  } catch (error) {
    alert(`Subscription failed: ${error.response.data.message}`);
  }
};
</script>
