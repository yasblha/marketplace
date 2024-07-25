<template>
  <div class="newsletter-signup-container">
    <div class="newsletter-signup">
      <h2>Unsubscribe from our Newsletter</h2>
      <form @submit.prevent="unsubscribe">
        <input type="email" v-model="email" placeholder="Enter your email" required />
        <button type="submit">Unsubscribe</button>
      </form>
      <div v-if="unsubscribeMessage">{{ unsubscribeMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAlertStore } from '@/stores/alert';

const email = ref('');
const unsubscribeMessage = ref('');

const alertStore = useAlertStore();

const unsubscribe = async () => {
  try {
    await alertStore.unsubscribeFromNewsletter(email.value);
    unsubscribeMessage.value = 'Unsubscribed successfully!';
  } catch (error) {
    unsubscribeMessage.value = `Error: ${error.response ? error.response.data.error : error.message}`;
  }
};
</script>

<style scoped>
.newsletter-signup-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.newsletter-signup {
  max-width: 400px;
  text-align: center;
}

.newsletter-signup form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.newsletter-signup input {
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
}

.newsletter-signup button {
  padding: 10px;
  font-size: 16px;
}
</style>
