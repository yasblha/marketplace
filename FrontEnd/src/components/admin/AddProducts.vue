<template>
  <div>
    <h2>Add New Products</h2>
    <form @submit.prevent="addProduct">
      <div>
        <label for="productName">Product Name:</label>
        <input v-model="productName" id="productName" type="text" required />
      </div>
      <div>
        <label for="price">Price:</label>
        <input v-model.number="price" id="price" type="number" required />
      </div>
      <button type="submit">Add Product</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const productName = ref('');
const price = ref(0);

const addProduct = () => {
  console.log('Adding product:', { productName: productName.value, price: price.value });
  productName.value = '';
  price.value = 0;
};
</script>

<style scoped>
</style>
