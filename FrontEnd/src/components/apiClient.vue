<script setup>
import { ref } from 'vue';
import apiClient from './api'; // Importez le client API configuré

const email = ref('');
const alertType = ref('newProduct');

const subscribe = async () => {
  try {
    const response = await apiClient.post('/api/subscribe', { email: email.value, alertType: alertType.value });
    alert(`Subscription successful: ${response.data.message}`);
  } catch (error) {
    console.error(error); // Ajout de cette ligne pour aider au débogage
    if (error.response && error.response.data && error.response.data.message) {
      alert(`Subscription failed: ${error.response.data.message}`);
    } else {
      alert(`Subscription failed: ${error.message}`);
    }
  }
};
</script>
