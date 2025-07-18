<template>
  <section class="py-8 px-4 md:px-8 lg:px-12">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Mes Favoris</h1>
        <p class="text-gray-600">Retrouvez ici tous les produits que vous avez ajoutés à vos favoris</p>
      </div>

      <!-- État vide -->
      <div v-if="!favoriteProducts.length && !isLoading" class="text-center py-12">
        <div class="mb-4">
          <i class="fas fa-heart text-5xl text-gray-300"></i>
        </div>
        <h2 class="text-xl font-medium text-gray-900 mb-2">Votre liste de favoris est vide</h2>
        <p class="text-gray-500 mb-6">Ajoutez des produits à vos favoris pour les retrouver facilement</p>
        <router-link to="/products" class="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Découvrir nos produits
        </router-link>
      </div>

      <!-- État de chargement -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Liste des favoris -->
      <div v-if="favoriteProducts.length && !isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="product in favoriteProducts" 
          :key="product.id" 
          class="bg-white rounded-lg shadow overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="relative">
            <img 
              :src="product.imageUrl || 'https://via.placeholder.com/300x300?text=Image+non+disponible'" 
              :alt="product.name"
              class="w-full h-48 object-cover"
            >
            <button 
              @click="removeFromFavorites(product)"
              class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white text-red-500 flex items-center justify-center shadow hover:bg-gray-100"
            >
              <i class="fas fa-heart"></i>
            </button>
          </div>
          
          <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900 truncate mb-1">{{ product.name }}</h3>
            <p class="text-xl font-semibold text-blue-600">{{ formatPrice(product.price) }}</p>
            
            <div class="mt-4 flex items-center justify-between">
              <router-link 
                :to="`/product/${product.id}`"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Voir le produit
              </router-link>
              
              <button 
                @click="addToCart(product)"
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i class="fas fa-shopping-cart mr-1"></i> Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div v-if="favoriteProducts.length && !isLoading" class="mt-8 flex justify-center">
        <button 
          @click="clearFavorites"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i class="far fa-trash-alt mr-2"></i> Vider ma liste
        </button>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/user';
import { useCartStore } from '@/stores/panier';
import { useWishlistStore } from '@/stores/wishlist';
import { useToast } from '@/composables/useToast';
import Footer from "../components/UI/Footer.vue";
import axiosInstance from "@/services/api";

// Stores et composables
const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const { showToast } = useToast();

// État
const favoriteProducts = ref([]);
const isLoading = ref(true);

// Récupérer les favoris en fonction de l'état d'authentification
const fetchFavorites = async () => {
  try {
    isLoading.value = true;
    
    if (authStore.isAuthenticated) {
      // Si l'utilisateur est connecté, récupérer les favoris depuis l'API
      try {
        const response = await axiosInstance.get(`/favorites`);
        favoriteProducts.value = response.data;
        
        // Synchroniser avec le store local
        wishlistStore.syncWithBackend(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris depuis l'API:", error);
        // En cas d'échec, utiliser les favoris du localStorage
        favoriteProducts.value = wishlistStore.items;
      }
    } else {
      // Si l'utilisateur n'est pas connecté, utiliser les favoris du localStorage
      wishlistStore.loadWishlist();
      favoriteProducts.value = wishlistStore.items;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    showToast("Erreur lors du chargement des favoris", "error");
  } finally {
    isLoading.value = false;
  }
};

// Retirer un produit des favoris
const removeFromFavorites = async (product) => {
  try {
    const productId = product.id || product._id;
    
    if (authStore.isAuthenticated) {
      // Si l'utilisateur est connecté, supprimer le favori via l'API
      await axiosInstance.delete(`/favorites/${productId}`);
    }
    
    // Supprimer du store local
    wishlistStore.removeFromWishlist(productId);
    
    // Mettre à jour la liste affichée
    favoriteProducts.value = favoriteProducts.value.filter(item => (item.id || item._id) !== productId);
    
    showToast("Produit retiré des favoris", "success");
  } catch (error) {
    console.error("Erreur lors de la suppression du favori:", error);
    showToast("Erreur lors de la suppression", "error");
  }
};

// Ajouter un produit au panier
const addToCart = async (product) => {
  try {
    await cartStore.addToCart({ 
      productId: product.id || product._id,
      quantity: 1,
      name: product.name,
      price: product.price,
      image: product.imageUrl
    });
    showToast("Produit ajouté au panier", "success");
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    showToast("Erreur lors de l'ajout au panier", "error");
  }
};

// Vider la liste de favoris
const clearFavorites = async () => {
  try {
    if (authStore.isAuthenticated) {
      // Si l'utilisateur est connecté, vider les favoris via l'API
      await axiosInstance.delete('/favorites');
    }
    
    // Vider le store local
    wishlistStore.clearWishlist();
    favoriteProducts.value = [];
    
    showToast("Liste de favoris vidée", "success");
  } catch (error) {
    console.error("Erreur lors de la suppression des favoris:", error);
    showToast("Erreur lors de la suppression", "error");
  }
};

// Formater le prix
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

// Initialiser les données au chargement du composant
onMounted(() => {
  fetchFavorites();
});
</script>

<style scoped>
section {
  padding: 18px;
}

div.titles {
  text-align: center;
}

div.buttonShopAll {
  text-align: center;
  margin: 23px;
}

div.buttonShopAll button {
  border: 1px solid black;
  padding: 9px;
  width: 10%;
  background: whitesmoke;
}

div.lesproduits {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

div.produit {
  width: 20%;
  margin-left: 4px;
  padding: 17px;
}

.productImage {
  width: -webkit-fill-available;
  margin: auto;
  height: auto;
}

div.productinfos {
  display: flex;
}

div.productinfos span {}

div.productinfos img {
  width: 16px;
  height: 16px;
  margin-left: auto;
}

div.price {}

div.price span {}
</style>