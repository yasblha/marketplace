<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">Filtres</h2>
      <button 
        @click="resetFilters"
        class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        :disabled="!hasActiveFilters"
        :class="{ 'opacity-50 cursor-not-allowed': !hasActiveFilters }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Réinitialiser
      </button>
    </div>

    <!-- Recherche par nom -->
    <div class="mb-6">
      <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input
          id="search"
          v-model="activeFilters.name"
          @input="handleSearch"
          type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Rechercher un produit..."
        />
      </div>
    </div>

    <!-- Catégories -->
    <div class="mb-8">
      <h3 class="text-sm font-medium text-gray-700 mb-3">Catégories</h3>
      <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
        <div 
          v-for="category in categories" 
          :key="category"
          @click="filterByCategory(category)"
          class="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
          :class="{ 
            'bg-blue-50 border-l-4 border-blue-500 pl-3': activeFilters.category === category,
            'pl-4': activeFilters.category !== category
          }"
        >
          <span 
            class="text-sm truncate"
            :class="{ 'font-medium text-blue-700': activeFilters.category === category, 'text-gray-700': activeFilters.category !== category }"
          >
            {{ category }}
          </span>
          <span 
            class="text-xs px-2 py-1 rounded-full min-w-6 text-center"
            :class="activeFilters.category === category ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'"
          >
            {{ getProductCountByCategory(category) }}
          </span>
        </div>
        <p v-if="categories.length === 0" class="text-sm text-gray-500 italic">Aucune catégorie disponible</p>
      </div>
    </div>

    <!-- Marques -->
    <div class="mb-8" v-if="brands.length > 0">
      <h3 class="text-sm font-medium text-gray-700 mb-3">Marques</h3>
      <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
        <div 
          v-for="brand in brands" 
          :key="brand"
          @click="filterByBrand(brand)"
          class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{ 'bg-blue-50': activeFilters.brand === brand }"
        >
          <input 
            type="radio" 
            :id="`brand-${brand}`"
            :checked="activeFilters.brand === brand"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            @change="filterByBrand(brand)"
          />
          <label 
            :for="`brand-${brand}`" 
            class="ml-3 text-sm text-gray-700 flex-1 cursor-pointer"
            :class="{ 'font-medium': activeFilters.brand === brand }"
          >
            {{ brand }}
          </label>
          <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
            {{ getProductCountByBrand(brand) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Prix -->
    <div class="mb-8">
      <h3 class="text-sm font-medium text-gray-700 mb-3">Prix</h3>
      <div class="space-y-4">
        <div class="px-1">
          <div class="relative pt-1">
            <div class="flex justify-between text-xs mb-2">
              <span class="text-gray-600">{{ formatPrice(priceRange.min) }}</span>
              <span class="text-gray-600">{{ formatPrice(priceRange.max) }}</span>
            </div>
            <div class="relative">
              <div class="h-2 bg-gray-200 rounded-full">
                <div 
                  class="h-full bg-blue-500 rounded-full"
                  :style="{
                    width: priceFillWidth + '%',
                    marginLeft: (activeFilters.priceMin / priceRange.max * 100) + '%'
                  }"
                ></div>
              </div>
              <input 
                type="range" 
                v-model.number="activeFilters.priceMin"
                :min="priceRange.min" 
                :max="priceRange.max"
                step="10"
                @input="handlePriceChange('min')"
                class="absolute w-full h-2 -top-2 appearance-none pointer-events-none opacity-0"
              />
              <input 
                type="range" 
                v-model.number="activeFilters.priceMax"
                :min="priceRange.min" 
                :max="priceRange.max"
                step="10"
                @input="handlePriceChange('max')"
                class="absolute w-full h-2 -top-2 appearance-none pointer-events-none opacity-0"
              />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Min (€)</label>
            <input 
              type="number" 
              v-model.number="activeFilters.priceMin"
              @change="handlePriceInput('min')"
              :min="priceRange.min"
              :max="activeFilters.priceMax || priceRange.max"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              :placeholder="priceRange.min.toString()"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Max (€)</label>
            <input 
              type="number" 
              v-model.number="activeFilters.priceMax"
              @change="handlePriceInput('max')"
              :min="activeFilters.priceMin || priceRange.min"
              :max="priceRange.max"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              :placeholder="priceRange.max.toString()"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- En stock -->
    <div class="flex items-center p-3 bg-gray-50 rounded-lg">
      <input 
        id="inStock" 
        type="checkbox" 
        v-model="activeFilters.inStock"
        @change="handleFilter"
        class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <label for="inStock" class="ml-3 text-sm text-gray-700">En stock uniquement</label>
    </div>

    <!-- Badge de filtres actifs -->
    <div v-if="activeFilterCount > 0" class="mt-6">
      <div class="flex flex-wrap gap-2">
        <span 
          v-if="activeFilters.category"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {{ activeFilters.category }}
          <button @click="removeFilter('category')" class="ml-1.5 text-blue-500 hover:text-blue-700">
            <span class="sr-only">Supprimer le filtre</span>
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </span>
        <span 
          v-if="activeFilters.brand"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
        >
          {{ activeFilters.brand }}
          <button @click="removeFilter('brand')" class="ml-1.5 text-green-500 hover:text-green-700">
            <span class="sr-only">Supprimer le filtre</span>
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </span>
        <span 
          v-if="activeFilters.priceMin || activeFilters.priceMax"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
        >
          {{ formatPrice(activeFilters.priceMin || priceRange.min) }} - {{ formatPrice(activeFilters.priceMax || priceRange.max) }}
          <button @click="removePriceFilter" class="ml-1.5 text-purple-500 hover:text-purple-700">
            <span class="sr-only">Supprimer le filtre de prix</span>
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </span>
        <span 
          v-if="activeFilters.inStock"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
        >
          En stock
          <button @click="removeFilter('inStock')" class="ml-1.5 text-yellow-500 hover:text-yellow-700">
            <span class="sr-only">Supprimer le filtre</span>
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue';
import type { SearchCriteria, Product } from '@/stores/products';

const props = defineProps<{
  products: Product[];
  initialFilters?: SearchCriteria;
}>();

const emit = defineEmits<{
  (e: 'update:filters', filters: SearchCriteria): void;
  (e: 'filter'): void;
}>();

// État réactif pour les filtres
const activeFilters = ref<SearchCriteria>({
  name: '',
  category: '',
  brand: '',
  priceMin: undefined,
  priceMax: undefined,
  inStock: false
});

// Plage de prix dynamique basée sur les produits
const priceRange = computed(() => {
  if (props.products.length === 0) {
    return { min: 0, max: 1000 };
  }
  
  const prices = props.products.map(p => p.price);
  const min = Math.floor(Math.min(...prices) / 10) * 10; // Arrondi à la dizaine inférieure
  const max = Math.ceil(Math.max(...prices) / 10) * 10; // Arrondi à la dizaine supérieure
  
  return { 
    min: min > 0 ? min : 0, 
    max: max > 0 ? max : 1000 
  };
});

// Largeur de remplissage pour la barre de prix
const priceFillWidth = computed(() => {
  if (!activeFilters.value.priceMin && !activeFilters.value.priceMax) return 100;
  
  const min = activeFilters.value.priceMin || priceRange.value.min;
  const max = activeFilters.value.priceMax || priceRange.value.max;
  
  return ((max - min) / (priceRange.value.max - priceRange.value.min)) * 100;
});

// Liste des marques uniques
const brands = computed(() => {
  const uniqueBrands = new Set<string>();
  props.products.forEach(product => {
    if (product.brand) {
      uniqueBrands.add(product.brand);
    }
  });
  return Array.from(uniqueBrands).sort();
});

// Liste des catégories uniques
const categories = computed(() => {
  const uniqueCategories = new Set<string>();
  props.products.forEach(product => {
    if (product.category) {
      uniqueCategories.add(product.category);
    }
  });
  return Array.from(uniqueCategories).sort();
});

// Nombre de filtres actifs
const activeFilterCount = computed(() => {
  return Object.entries(activeFilters.value).filter(([key, value]) => {
    if (key === 'priceMin' || key === 'priceMax') {
      return value !== undefined && value !== null && value !== '';
    }
    return !!value;
  }).length;
});

// Vérifie s'il y a des filtres actifs
const hasActiveFilters = computed(() => activeFilterCount.value > 0);

// Initialiser avec les filtres initiaux
if (props.initialFilters) {
  activeFilters.value = { ...activeFilters.value, ...props.initialFilters };
  
  // S'assurer que les prix sont des nombres
  if (activeFilters.value.priceMin !== undefined) {
    activeFilters.value.priceMin = Number(activeFilters.value.priceMin);
  }
  if (activeFilters.value.priceMax !== undefined) {
    activeFilters.value.priceMax = Number(activeFilters.value.priceMax);
  }
}

// Émettre les changements de filtres
watch(activeFilters, (newFilters) => {
  emit('update:filters', { ...newFilters });
}, { deep: true });

/**
 * Formate un prix avec le symbole €
 */
const formatPrice = (price: number | undefined) => {
  if (price === undefined || price === null) return '';
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0 
  }).format(price);
};

/**
 * Gère le changement de prix via la barre de défilement
 */
const handlePriceChange = (type: 'min' | 'max') => {
  // S'assurer que min ne dépasse pas max et vice versa
  if (type === 'min' && activeFilters.value.priceMin && activeFilters.value.priceMax && 
      activeFilters.value.priceMin > activeFilters.value.priceMax) {
    activeFilters.value.priceMin = activeFilters.value.priceMax;
  } else if (type === 'max' && activeFilters.value.priceMin && activeFilters.value.priceMax && 
             activeFilters.value.priceMax < activeFilters.value.priceMin) {
    activeFilters.value.priceMax = activeFilters.value.priceMin;
  }
  
  // Délai pour éviter les appels trop fréquents
  debouncedFilter();
};

/**
 * Gère la saisie manuelle des prix
 */
const handlePriceInput = (type: 'min' | 'max') => {
  // S'assurer que les valeurs sont dans les limites
  if (type === 'min' && activeFilters.value.priceMin !== undefined) {
    activeFilters.value.priceMin = Math.max(priceRange.value.min, Math.min(activeFilters.value.priceMin, priceRange.value.max));
    if (activeFilters.value.priceMax !== undefined && activeFilters.value.priceMin > activeFilters.value.priceMax) {
      activeFilters.value.priceMax = activeFilters.value.priceMin;
    }
  } else if (type === 'max' && activeFilters.value.priceMax !== undefined) {
    activeFilters.value.priceMax = Math.max(priceRange.value.min, Math.min(activeFilters.value.priceMax, priceRange.value.max));
    if (activeFilters.value.priceMin !== undefined && activeFilters.value.priceMax < activeFilters.value.priceMin) {
      activeFilters.value.priceMin = activeFilters.value.priceMax;
    }
  }
  
  handleFilter();
};

/**
 * Délai pour éviter les appels trop fréquents lors du glissement
 */
let debounceTimer: ReturnType<typeof setTimeout>;
const debouncedFilter = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    handleFilter();
  }, 300);
};

/**
 * Gère la recherche avec un délai
 */
const handleSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    handleFilter();
  }, 500);
};

/**
 * Filtre par marque
 */
const filterByBrand = (brand: string) => {
  activeFilters.value.brand = activeFilters.value.brand === brand ? '' : brand;
  handleFilter();
};

/**
 * Filtre par catégorie
 */
const filterByCategory = (category: string) => {
  activeFilters.value.category = activeFilters.value.category === category ? '' : category;
  handleFilter();
};

/**
 * Supprime un filtre spécifique
 */
const removeFilter = (filterKey: keyof SearchCriteria) => {
  if (filterKey === 'priceMin' || filterKey === 'priceMax') {
    activeFilters.value[filterKey] = undefined;
  } else if (filterKey === 'inStock') {
    activeFilters.value[filterKey] = false;
  } else {
    activeFilters.value[filterKey] = '';
  }
  
  handleFilter();
};

/**
 * Supprime le filtre de prix
 */
const removePriceFilter = () => {
  activeFilters.value.priceMin = undefined;
  activeFilters.value.priceMax = undefined;
  handleFilter();
};

/**
 * Réinitialise tous les filtres
 */
const resetFilters = () => {
  if (!hasActiveFilters.value) return;
  
  activeFilters.value = {
    name: '',
    category: '',
    brand: '',
    priceMin: undefined,
    priceMax: undefined,
    inStock: false
  };
  
  handleFilter();
};

/**
 * Applique les filtres
 */
const handleFilter = () => {
  emit('filter');
};

/**
 * Compte le nombre de produits par marque
 */
const getProductCountByBrand = (brand: string) => {
  return props.products.filter(p => p.brand === brand).length;
};

/**
 * Compte le nombre de produits par catégorie
 */
const getProductCountByCategory = (category: string) => {
  return props.products.filter(p => p.category === category).length;
};

defineExpose({
  resetFilters
});
</script>
