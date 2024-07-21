<template>
  <div class="search-results">
    <h1>Résultats de recherche</h1>
    <div v-if="products.length > 0">
      <div v-for="product in products" :key="product._id" class="product-item">
        <img :src="getImage(product)" :alt="product.name" />
        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <span>{{ product.price }}€</span>
      </div>
    </div>
    <div v-else>
      <p>Aucun produit trouvé</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/products';
import type {  Product, SearchCriteria } from '@/stores/products';
import defaultImage from "@/assets/ui_assets/image1.png";

const route = useRoute();
const productStore = useProductStore();
const products = ref<Product[]>([]);

const fetchSearchResults = async () => {
  const searchCriteria: SearchCriteria = {
    name: route.query.name as string,
    description: route.query.description as string,
    category: route.query.category as string,
    brand: route.query.brand as string,
    priceMin: route.query.priceMin ? parseFloat(route.query.priceMin as string) : undefined,
    priceMax: route.query.priceMax ? parseFloat(route.query.priceMax as string) : undefined,
    onSale: route.query.onSale ? route.query.onSale === 'true' : undefined,
    inStock: route.query.inStock ? route.query.inStock === 'true' : undefined,
  };

  await productStore.searchFacetedProducts(searchCriteria);
  products.value = productStore.products;
};

onMounted(fetchSearchResults);
watch(() => route.query, fetchSearchResults);

const getImage = (product: { images: string[] }) => {
  if (product.images && product.images.length > 0) {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${product.images[0]}`;
  }
  return defaultImage;
};
</script>

<style scoped>
.search-results {
  padding: 20px;
}

.product-item {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 20px;
}

.product-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
}

.product-item h2 {
  font-size: 18px;
  margin: 0;
}

.product-item p {
  margin: 5px 0;
}

.product-item span {
  font-weight: bold;
  color: #23a6f0;
}
</style>
