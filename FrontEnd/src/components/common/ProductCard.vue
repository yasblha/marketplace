<template>
  <div class="product-card group">
    <div class="relative overflow-hidden rounded-lg bg-gray-100 aspect-w-1 aspect-h-1">
      <!-- Badge de promotion -->
      <div v-if="product.discount > 0" class="absolute top-2 right-2 z-10">
        <span class="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          -{{ product.discount }}%
        </span>
      </div>
      
      <!-- Image du produit -->
      <img 
        :src="product.images?.[0] || '/placeholder-product.jpg'" 
        :alt="product.name"
        class="w-full h-48 object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
      />
      
      <!-- Actions rapides -->
      <div class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30">
        <button 
          @click.stop="addToWishlist" 
          class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          :title="isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        >
          <i :class="[isInWishlist ? 'fas' : 'far', 'fa-heart', 'text-red-500']"></i>
        </button>
        <button 
          @click.stop="addToCart" 
          class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          title="Ajouter au panier"
        >
          <i class="fas fa-shopping-cart text-gray-700"></i>
        </button>
        <button 
          @click.stop="viewDetails" 
          class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          title="Voir les détails"
        >
          <i class="fas fa-eye text-gray-700"></i>
        </button>
      </div>
    </div>
    
    <div class="mt-4">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 h-12">
            {{ product.name }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">{{ product.brand }}</p>
        </div>
        
        <!-- Prix -->
        <div class="text-right">
          <p v-if="product.discount > 0" class="text-sm text-gray-500 line-through">
            {{ formatPrice(calculateOriginalPrice()) }}
          </p>
          <p class="text-base font-medium text-gray-900">
            {{ formatPrice(calculateDiscountedPrice()) }}
          </p>
        </div>
      </div>
      
      <!-- Évaluation -->
      <div class="mt-2 flex items-center">
        <div class="flex">
          <i v-for="i in 5" :key="i" 
            :class="[
              'fas',
              i <= Math.round(product.rating || 0) ? 'fa-star text-yellow-400' : 'fa-star text-gray-300',
              'text-sm'
            ]"
          ></i>
        </div>
        <span class="ml-1 text-xs text-gray-500">({{ product.reviewCount || 0 }})</span>
      </div>
      
      <!-- Stock -->
      <div class="mt-2">
        <div class="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            class="bg-green-500 h-1.5 rounded-full" 
            :style="{ width: `${Math.min(100, (product.stock_available / product.stock_total) * 100)}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ product.stock_available }} en stock sur {{ product.stock_total }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/panier';
import { useWishlistStore } from '@/stores/wishlist';

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      brand: '',
      price: 0,
      discount: 0,
      rating: 0,
      reviewCount: 0,
      stock_available: 0,
      stock_total: 0,
      images: []
    })
  }
});

const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

const isInWishlist = computed(() => {
  return wishlistStore.items.some(item => item.id === props.product.id);
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const calculateOriginalPrice = (): number => {
  return props.product.price;
};

const calculateDiscountedPrice = (): number => {
  if (props.product.discount > 0) {
    return props.product.price * (1 - props.product.discount / 100);
  }
  return props.product.price;
};

const addToCart = (): void => {
  cartStore.addToCart(props.product, 1);
};

const addToWishlist = (): void => {
  if (isInWishlist.value) {
    wishlistStore.removeFromWishlist(props.product.id);
  } else {
    wishlistStore.addToWishlist(props.product);
  }
};

const viewDetails = (): void => {
  router.push({ name: 'product', params: { id: props.product.id } });
};
</script>

<style scoped>
.product-card {
  @apply p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
