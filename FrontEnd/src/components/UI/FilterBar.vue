<template>
  <div class="filter-bar">
    <div class="showing">
      <span class="text-sm md:text-base">{{ totalResults }} résultats</span>
      <span v-if="activeFilterCount > 0" class="active-filters">
        {{ activeFilterCount }} filtre(s) actif(s)
        <button @click="clearAllFilters" class="clear-all">
          <span class="sr-only">Effacer tous les filtres</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </span>
    </div>

    
        <button 
          @click="$emit('change-view', 'grid')" 
          :class="['p-2 rounded', viewType === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700']"
          :title="viewType === 'grid' ? 'Vue grille' : 'Changer vers la vue grille'"
          aria-label="Vue grille"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button 
          @click="$emit('change-view', 'list')" 
          :class="['p-2 rounded', viewType === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700']"
          :title="viewType === 'list' ? 'Vue liste' : 'Changer vers la vue liste'"
          aria-label="Vue liste"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>



    <!-- Filter Panel -->
    <Transition name="fade">
      <div v-if="showFilterPanel" class="filter-panel">
        <div class="filter-panel-content">
          <div class="filter-section">
            <h3 class="filter-section-title">Catégories</h3>
            <div class="space-y-2">
              <label v-for="category in categories" :key="category" class="flex items-center">
                <input 
                  type="checkbox" 
                  :value="category"
                  v-model="selectedCategories"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700">{{ category }}</span>
              </label>
            </div>
          </div>
        </div>

          <div class="filter-section">
            <h3 class="filter-section-title">Prix</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between w-full">
        <div class="flex items-center">
          <span class="text-sm text-gray-500 mr-4 hidden sm:inline">Vue :</span>
          <div class="view-toggle">
                <div class="flex-1">
                  <label for="min-price" class="block text-sm font-medium text-gray-700 mb-1">Min</label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">€</span>
                    </div>
                    <input 
                      type="number" 
                      id="min-price" 
                      v-model.number="priceRange[0]"
                      class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0"
                    >
                  </div>
                </div>
                <div class="flex-1">
                  <label for="max-price" class="block text-sm font-medium text-gray-700 mb-1">Max</label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">€</span>
                    </div>
                    <input 
                      type="number" 
                      id="max-price" 
                      v-model.number="priceRange[1]"
                      class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="1000"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="filter-section">
            <div class="flex items-center">
              <input 
                id="in-stock" 
                type="checkbox" 
                v-model="inStockOnly"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="in-stock" class="ml-2 block text-sm text-gray-700">En stock uniquement</label>
            </div>
          </div>

          <div class="filter-actions">
            <button 
              type="button" 
              @click="resetFilters"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Réinitialiser
            </button>
            <button type="button" @click="applyFilters">
            </button>
          </div>
        </div>
      </div>
    </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps<{
  totalResults: number,
  initialSort: string,
  initialFilters?: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    inStock?: boolean;
  };
  categories?: string[];
  viewType?: 'grid' | 'list';
}>();

const emit = defineEmits(['change-view', 'sort', 'filter', 'update:filters']);

// State
const selectedSort = ref(props.initialSort);
const showFilterPanel = ref(false);
const selectedCategories = ref<string[]>([]);
const priceRange = ref<[number | undefined, number | undefined]>([undefined, undefined]);
const inStockOnly = ref(false);

// Computed
const activeFilterCount = computed(() => {
  let count = 0;
  if (selectedCategories.value.length > 0) count += selectedCategories.value.length;
  if (priceRange.value[0] !== undefined || priceRange.value[1] !== undefined) count += 1;
  if (inStockOnly.value) count += 1;
  return count;
});

const currentFilters = computed(() => ({
  categories: selectedCategories.value,
  priceMin: priceRange.value[0],
  priceMax: priceRange.value[1],
  inStock: inStockOnly.value
}));

// Methods
const toggleFilterPanel = () => {
  showFilterPanel.value = !showFilterPanel.value;
};

const handleSortChange = () => {
  emit('sort', selectedSort.value);
};

const applyFilters = () => {
  emit('update:filters', currentFilters.value);
  showFilterPanel.value = false;
};

const resetFilters = () => {
  selectedCategories.value = [];
  priceRange.value = [undefined, undefined];
  inStockOnly.value = false;
};

const clearAllFilters = () => {
  resetFilters();
  applyFilters();};

// Initialize with props
onMounted(() => {
  if (props.initialFilters) {
    if (props.initialFilters.category) {
      selectedCategories.value = [props.initialFilters.category];
    }
    if (props.initialFilters.priceMin !== undefined) {
      priceRange.value[0] = props.initialFilters.priceMin;
    }
    if (props.initialFilters.priceMax !== undefined) {
      priceRange.value[1] = props.initialFilters.priceMax;
    }
    inStockOnly.value = props.initialFilters.inStock || false;
  }
});

// Watch for external filter changes
watch(() => props.initialFilters, (newFilters) => {
  if (newFilters) {
    if (newFilters.category) {
      selectedCategories.value = [newFilters.category];
    }
    priceRange.value = [newFilters.priceMin, newFilters.priceMax];
    inStockOnly.value = newFilters.inStock || false;
  }
}, { deep: true });
</script>

<style scoped>
.filter-bar {
  @apply bg-white py-3 px-4 border-b border-gray-200 sticky top-0 z-10;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.8);
}

.showing {
  @apply flex items-center text-sm text-gray-600;
  white-space: nowrap;
  margin-right: 1rem;
}

.active-filters {
  @apply ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800;
}

.clear-all {
  @apply ml-1.5 inline-flex items-center justify-center text-blue-600 hover:text-blue-800 focus:outline-none;
}

.view-toggle {
  @apply inline-flex rounded-md bg-gray-100 p-1 mr-4;
}

.view-toggle button {
  @apply p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-50;
  transition: all 0.2s ease-in-out;
}

.view-toggle button.active {
  @apply text-blue-600 bg-white shadow-sm;
}

/* Filter Panel */
.filter-panel {
  @apply absolute inset-x-0 mt-1 bg-white shadow-lg rounded-b-md z-10 border border-gray-200;
  top: 100%;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}

.filter-panel-content {
  @apply p-6 space-y-6;
}

.filter-section {
  @apply border-b border-gray-200 pb-6 last:border-b-0 last:pb-0;
}

.filter-section-title {
  @apply text-sm font-medium text-gray-700 mb-3;
}

.filter-actions {
  @apply flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom select styles */
select {
  @apply appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Responsive */
@media (max-width: 767px) {
  .filter-bar {
    @apply flex-col items-stretch;
  }
  
  .filter-actions {
    @apply flex-col space-y-3 space-x-0;
  }
  
  .filter-actions button {
    @apply w-full justify-center;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .filter-bar {
    @apply bg-gray-800 border-gray-700;
  }
  
  .filter-panel {
    @apply bg-gray-800 border-gray-700;
  }
  
  .filter-section {
    @apply border-gray-700;
  }
  
  .filter-section-title {
    @apply text-gray-300;
  }
  
  select {
    @apply bg-gray-700 border-gray-600 text-white;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  }
  
  .view-toggle {
    @apply bg-gray-700;
  }
  
  .view-toggle button {
    @apply text-gray-400 hover:bg-gray-600;
  }
  
  .view-toggle button.active {
    @apply bg-gray-600 text-white;
  }
}
</style>
