<template>
  <NavigationBar />
  <section>
    <div class="Barshop">
      <h2>Shop</h2>
      <div>
        <a href="">Home</a>
        <a href=""><img src="../assets/fd.svg" alt=""></a>
        <a href="">Shop</a>
      </div>
    </div>

    <div class="Categ">
      <div v-for="category in categories" :key="category" class="category-item">
        <div>
          <span>{{ category.toUpperCase() }}</span>
        </div>
      </div>
    </div>

    <div class="LesProd">
      <div class="filtreBar">
        <div class="Showing">
          <span>Showing all {{ products.length }} results</span>
        </div>
        <div class="views">
          <span>Views:</span>
          <img src="../assets/Menu.png" alt="">
          <img src="../assets/Menu2.png" alt="">
        </div>
        <div class="PandF">
          <a href="" class="Popularity">Popularity</a>
          <a href="" class="Filter">Filter</a>
        </div>
      </div>
      <FicheProducts :products="products" />
      <Footer />
    </div>
  </section>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '@/stores/products';
import NavigationBar from "../components/UI/NavigationBar.vue";
import FicheProducts from "../components/UI/FicheProducts.vue";
import Footer from "@/components/UI/Footer.vue";

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

const productStore = useProductStore();
const products = ref<Product[]>([]);

const categories = computed(() => {
  const uniqueCategories = new Set(products.value.map(product => product.category));
  return Array.from(uniqueCategories);
});

onMounted(async () => {
  await productStore.fetchProducts();
  products.value = productStore.products;
});
</script>


<style scoped>
div.Barshop {
  padding: 11px;
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: auto;
  margin-top: 16px;
}

.Barshop h2 {
  color: rgba(37, 43, 66, 1);
  font-weight: 600;
}

.Barshop div {
  display: flex;
}

.Barshop div a {
  margin-left: 12px;
  font-size: 14px;
  color: black;
}

div.Categ {
  display: flex;
  flex-wrap: wrap;
  width: 82%;
  padding: 36px;
  margin: auto;
}

.category-item {
  height: 206px;
  background-size: cover;
  background-position: center;
  width: calc(20% - 14px);
  margin: 7px;
  z-index: 1;
  opacity: 0.8;
  position: relative;
}

.category-item div {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.category-item span {
  color: white;
  font-weight: 600;
  font-size: medium;
}

.category-item:nth-child(1) { background-image: url('../assets/items51.jpg'); }
.category-item:nth-child(2) { background-image: url('../assets/items52.jpg'); }
.category-item:nth-child(3) { background-image: url('../assets/items53.jpg'); }
.category-item:nth-child(4) { background-image: url('../assets/items54.jpg'); }
.category-item:nth-child(5) { background-image: url('../assets/items55.jpg'); }

div.filtreBar {
  display: flex;
  width: 100%;
  justify-content: space-around;
}

.showing {
  display: flex;
}

div.views {
  display: flex;
}

div.views img {
  width: 15%;
  height: 14px;
  margin: auto 10px;
}

.Popularity {
  padding: 10px;
  border: 1px solid #8080807a;
  border-radius: 7px;
  color: grey;
  font-size: 12px;
}

.Filter {
  padding: 10px 18px;
  background-color: rgba(35, 166, 240, 1);
  margin-left: 6px;
  border-radius: 7px;
  color: white;
  text-align: center;
  font-size: 12px;
}
</style>
