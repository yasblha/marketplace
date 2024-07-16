<template>
  <div class="itemsView">
    <a v-for="product in products" :key="product._id" :href="'/product/' + product._id">
      <div class="OneProduct">
        <img :src="getImage(product)" :alt="product.name">
        <h2>{{ product.name }}</h2>
        <p>{{ product.category }}</p>
        <div class="prices">
          <span class="priceNormal">${{ product.price.toFixed(2) }}</span>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import defaultImage from '@/assets/image1.png';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock_available: number;
  status: string;
  images: string[];
}

const props = defineProps<{
  products: Product[]
}>();

const getImage = (product: Product) => {
  if (product.images && product.images.length > 0) {
    const baseUrl = 'http://localhost:3000';
    console.log('image path:', product.images[0]);
    const imageUrl = `${baseUrl}/${product.images[0]}`;
    console.log('urlImage', imageUrl);

    return imageUrl;
    //return product.images[0];
  }
  return defaultImage;
};

console.log(props.products);
</script>

<style scoped>
div.itemsView {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  margin: 25px auto;
  width: 78%;
}

div.OneProduct {
  width: 100%;
  text-align: center;
  padding: 17px;
  margin: auto;
}

div.OneProduct img {
  object-fit: cover;
  width: 197px;
  height: 206px;
}

div.OneProduct h2 {
  font-size: 19px;
  color: black;
  margin-top: 6px;
}

div.OneProduct p {
  font-size: 14px;
  color: grey;
}

div.prices {
  margin-top: 6px;
}

.priceNormal {
  color: grey;
}

.priceBlue {
  color: rgba(35, 133, 109, 1);
  margin-left: 5px;
}
</style>
