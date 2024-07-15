<template>
  <NavigationBar />
  <section>
    <div class="Barshop">
      <div class="breadcrumb">
        <a href="">Home</a>
        <img src="../assets/fd.svg" alt="">
        <a href="">Shop</a>
      </div>
      <div class="search-bar">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Search products..."
            @input="filterProducts"
        />
        <button @click="filterProducts">Search</button>
      </div>
    </div>

    <div class="Categ">
      <button @click="prevCategory" class="carousel-button left">‹</button>
      <div class="carousel">
        <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * (100 / visibleSlides)}%)` }">
          <div v-for="category in categories" :key="category" class="category-item" @click="filterByCategory(category)">
            <div>
              <span>{{ category.toUpperCase() }}</span>
            </div>
          </div>
        </div>
      </div>
      <button @click="nextCategory" class="carousel-button right">›</button>
    </div>

    <div class="LesProd">
      <div class="filtreBar">
        <div class="Showing">
          <span>Showing all {{ filteredProducts.length }} results</span>
        </div>
        <div class="views">
          <span>Views:</span>
          <img src="../assets/Menu.png" alt="Grid View" @click="setGridView">
          <img src="../assets/Menu2.png" alt="List View" @click="setListView">
        </div>
        <div class="PandF">
          <select v-model="selectedSort" @change="sortProducts">
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>
      <div :class="['product-list', { 'list-view': isListView }]">
        <FicheProducts :products="filteredProducts" />
      </div>
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
  popularity: number;
}

const productStore = useProductStore();
const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const searchQuery = ref<string>('');
const selectedCategory = ref<string | null>(null);
const selectedSort = ref<string>('popularity');
const error = ref<string | null>(null);
const isLoading = ref(false);

const currentSlide = ref(0);
const visibleSlides = ref(3); // Number of visible slides
const isListView = ref(false); // State to manage view type

const categories = computed(() => {
  const uniqueCategories = new Set(products.value.map(product => product.category));
  return Array.from(uniqueCategories);
});

onMounted(async () => {
  isLoading.value = true;
  try {
    await productStore.fetchProducts();
    products.value = productStore.products;
    filteredProducts.value = products.value;
  } catch (err) {
    error.value = 'Error fetching products';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const nextCategory = () => {
  if (currentSlide.value < categories.value.length - visibleSlides.value) {
    currentSlide.value++;
  }
};

const prevCategory = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

const setGridView = () => {
  isListView.value = false;
};

const setListView = () => {
  isListView.value = true;
};

const filterProducts = () => {
  let filtered = products.value;

  if (searchQuery.value) {
    filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value);
  }

  sortProducts();

  filteredProducts.value = filtered;
};

const filterByCategory = (category: string) => {
  selectedCategory.value = category;
  filterProducts();
};

const sortProducts = () => {
  filteredProducts.value.sort((a, b) => {
    switch (selectedSort.value) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return b.popularity - a.popularity;
    }
  });
};
</script>

<style scoped>
div.Barshop {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 16px auto;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
}

.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb a {
  margin-left: 12px;
  font-size: 14px;
  color: black;
  text-decoration: none;
}

.search-bar {
  display: flex;
  align-items: center;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
}

.search-bar button {
  padding: 8px 12px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

div.Categ {
  display: flex;
  align-items: center;
  position: relative;
  width: 82%;
  padding: 36px;
  margin: auto;
}

.carousel {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.carousel-button.left {
  left: 0;
}

.carousel-button.right {
  right: 0;
}

.category-item {
  height: 206px;
  background-size: cover;
  background-position: center;
  min-width: calc(100% / 3); /* Adjust according to visible slides */
  margin: 0 5px;
  position: relative;
  cursor: pointer;
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
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
  margin-bottom: 20px;
}

.showing {
  display: flex;
}

div.views {
  display: flex;
  align-items: center;
}

div.views img {
  width: 20px;
  height: 20px;
  margin: 0 10px;
  cursor: pointer;
}

.PandF {
  display: flex;
  align-items: center;
}

.PandF select {
  padding: 10px;
  border-radius: 7px;
  border: 1px solid #ccc;
  color: grey;
  font-size: 12px;
}

.Popularity,
.Filter {
  padding: 10px 18px;
  margin-left: 6px;
  border-radius: 7px;
  color: white;
  text-align: center;
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;
}

.Popularity {
  background-color: #8080807a;
  border: 1px solid #8080807a;
}

.Filter {
  background-color: rgba(35, 166, 240, 1);
}

div.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

div.product-list.list-view {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  div.Barshop,
  div.filtreBar {
    flex-direction: column;
    align-items: flex-start;
  }

  div.views img {
    width: 20px;
    height: 20px;
  }

  div.product-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
