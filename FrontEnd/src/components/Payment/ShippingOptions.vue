<template>
  <section class="shipping-options">
    <div class="container">
      <h2>Shipping Options</h2>
      <form @submit.prevent="nextStep">
        <div class="form-group">
          <label for="shippingMethod">Choose a shipping method:</label>
          <select id="shippingMethod" v-model="shippingMethod" required>
            <option value="standard">Standard Shipping (5-7 days) - $5.00</option>
            <option value="express">Express Shipping (2-3 days) - $15.00</option>
            <option value="overnight">Overnight Shipping (1 day) - $25.00</option>
          </select>
        </div>
        <button type="submit">Continue to Payment</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const shippingMethod = ref('standard');

const nextStep = () => {
  localStorage.setItem('shippingMethod', shippingMethod.value);
  emit('next-step', 'Payment');
};
</script>

<style scoped>
</style>
