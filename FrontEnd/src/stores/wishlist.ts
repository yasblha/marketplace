import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<Array<{id: string, [key: string]: any}>>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Charger la wishlist depuis le localStorage
  const loadWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        items.value = JSON.parse(savedWishlist);
      }
    } catch (e) {
      console.error('Erreur lors du chargement de la wishlist:', e);
      error.value = 'Impossible de charger la liste de souhaits';
    }
  };

  // Sauvegarder la wishlist dans le localStorage
  const saveWishlist = () => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(items.value));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde de la wishlist:', e);
      error.value = 'Erreur lors de la sauvegarde de la liste de souhaits';
    }
  };

  // Ajouter un produit à la wishlist
  const addToWishlist = (product: {id: string, [key: string]: any}) => {
    if (!items.value.some(item => item.id === product.id)) {
      items.value.push(product);
      saveWishlist();
    }
  };

  // Retirer un produit de la wishlist
  const removeFromWishlist = (productId: string) => {
    const index = items.value.findIndex(item => item.id === productId);
    if (index !== -1) {
      items.value.splice(index, 1);
      saveWishlist();
    }
  };

  // Vérifier si un produit est dans la wishlist
  const isInWishlist = (productId: string) => {
    return items.value.some(item => item.id === productId);
  };

  // Toggle un produit dans la wishlist
  const toggleWishlistItem = (product: {id: string, [key: string]: any}) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Vider la wishlist
  const clearWishlist = () => {
    items.value = [];
    saveWishlist();
  };

  // Nombre d'articles dans la wishlist
  const wishlistCount = computed(() => items.value.length);

  return {
    items,
    wishlistCount,
    isLoading,
    error,
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlistItem,
    clearWishlist,
  };
});
