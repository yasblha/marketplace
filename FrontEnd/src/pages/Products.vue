<template>
  <BreadcrumbWithSearch @search="filterProducts" />
  <section>
    <CategoryCarousel :categories="categories" @select-category="filterByCategory" />
    <div class="LesProd">
      <FilterBar
          :totalResults="filteredProducts.length"
          :initialSort="selectedSort"
          @change-view="changeView"
          @sort="updateSort"
          @filter="filterProducts"
      />
      <div :class="['product-list', { 'list-view': isListView, 'grid-view': !isListView }]">
        <FicheProducts :products="filteredProducts" :isListView="isListView" />
      </div>
      <Footer />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '@/stores/products';
import NavigationBar from "../components/UI/NavigationBar.vue";
import BreadcrumbWithSearch from "../components/UI/SearchBar.vue";
import CategoryCarousel from "../components/UI/CategoryCarousel.vue";
import FilterBar from "../components/UI/FilterBar.vue";
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
const visibleSlides = ref(3);
const isListView = ref(true);

const categories = computed(() => {
  const uniqueCategories = new Set(products.value.map(product => product.category));
  return Array.from(uniqueCategories);
});

const addPopularityToProducts = (products: any[]): Product[] => {
  return products.map(product => ({
    ...product,
    popularity: product.popularity ?? 0
  }));
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await productStore.fetchProducts();
    products.value = addPopularityToProducts(productStore.products);
    filteredProducts.value = products.value;
  } catch (err) {
    error.value = 'Error fetching products';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const changeView = (view: string) => {
  isListView.value = view === 'list';
};

const filterProducts = (query?: string) => {
  if (query !== undefined) {
    searchQuery.value = query;
  }

  let filtered = products.value;

  if (searchQuery.value) {
    filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value);
  }

  // Sort the filtered products
  sortProducts();

  filteredProducts.value = filtered;
  console.log('Filtered products:', filteredProducts.value);
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

const updateSort = (sortValue: string) => {
  selectedSort.value = sortValue;
  filterProducts();
};
</script>

<style scoped>
div.LesProd {
  padding: 20px;
}

div.product-list {
  display: grid;
  gap: 20px;
  padding: 0 20px;
}

div.product-list.list-view {
  grid-template-columns: repeat(1, 1fr); /* Un produit par ligne pour la vue liste */
}

div.product-list.grid-view {
  grid-template-columns: repeat(4, 1fr); /* Quatre produits par ligne pour la vue grille */
}

@media (max-width: 768px) {
  div.product-list.grid-view {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
