<template>
  <div class="addresses-section">
    <h2>Mes Adresses</h2>
    <div v-for="address in addresses" :key="address.id" class="address-card">
      <p>{{ address.name }}</p>
      <p>{{ address.street }}</p>
      <p>{{ address.city }}, {{ address.state }} {{ address.zip }}</p>
      <p>{{ address.country }}</p>
      <button @click="removeAddress(address.id)">Supprimer</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const addresses = ref([
  { id: '1', name: 'Maison', street: '123 Rue Principale', city: 'Paris', state: 'IDF', zip: '75001', country: 'France' },
  { id: '2', name: 'Travail', street: '456 Rue de la République', city: 'Lyon', state: 'ARA', zip: '69000', country: 'France' },
]);

const removeAddress = (addressId: string) => {
};
</script>

<style scoped>
.addresses-section {
  max-width: 600px;
  margin: auto;
}

.address-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.address-card p {
  margin: 5px 0;
}

.address-card button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.address-card button:hover {
  background-color: #1d94d2;
}
</style>