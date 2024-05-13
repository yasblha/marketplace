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
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const email = ref('');
  const alertType = ref('newProduct');
  
  const unsubscribe = async () => {
    try {
      const response = await axios.post('/api/unsubscribe', { email: email.value, alertType: alertType.value });
      alert(`Unsubscription successful: ${response.data.message}`);
    } catch (error) {
      alert(`Unsubscription failed: ${error.response.data.message}`);
    }
  };
  </script>
  