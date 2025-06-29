<template>
  <div class="cart-container">
    <!-- Header du panier -->
    <div class="cart-header">
      <h2>🛒 Mon Panier</h2>
      <div class="cart-summary">
        <span class="item-count">{{ cartItems.length }} article(s)</span>
        <span class="total-price">{{ formatPrice(totalAmount) }}</span>
      </div>
    </div>

    <!-- Message d'alerte pour les réservations expirées -->
    <div v-if="hasExpiredItems" class="alert alert-warning">
      <i class="fas fa-exclamation-triangle"></i>
      Certains articles ont expiré et ont été retirés de votre panier.
    </div>

    <!-- Liste des articles -->
    <div v-if="cartItems.length > 0" class="cart-items">
      <div 
        v-for="item in cartItems" 
        :key="item.id" 
        class="cart-item"
        :class="{ 'expiring-soon': isExpiringSoon(item) }"
      >
        <!-- Image du produit -->
        <div class="product-image">
          <img 
            :src="item.product?.image || '/placeholder-product.jpg'" 
            :alt="item.product?.name"
            @error="handleImageError"
          />
        </div>

        <!-- Informations du produit -->
        <div class="product-info">
          <h3 class="product-name">{{ item.product?.name || 'Produit non trouvé' }}</h3>
          <p class="product-price">{{ formatPrice(item.product?.price || 0) }}</p>
          
          <!-- Timer de réservation -->
          <div class="reservation-timer" :class="{ 'expiring': isExpiringSoon(item) }">
            <i class="fas fa-clock"></i>
            <span v-if="item.remainingTime > 0">
              Réservé pour: {{ item.formattedRemainingTime }}
            </span>
            <span v-else class="expired">
              Réservation expirée
            </span>
          </div>
        </div>

        <!-- Contrôles de quantité -->
        <div class="quantity-controls">
          <button 
            @click="updateQuantity(item.id, item.quantity - 1)"
            :disabled="item.quantity <= 1"
            class="quantity-btn"
          >
            <i class="fas fa-minus"></i>
          </button>
          
          <span class="quantity">{{ item.quantity }}</span>
          
          <button 
            @click="updateQuantity(item.id, item.quantity + 1)"
            class="quantity-btn"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <!-- Prix total de l'article -->
        <div class="item-total">
          {{ formatPrice((item.product?.price || 0) * item.quantity) }}
        </div>

        <!-- Bouton supprimer -->
        <button @click="removeItem(item.id)" class="remove-btn">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <!-- Panier vide -->
    <div v-else class="empty-cart">
      <i class="fas fa-shopping-cart"></i>
      <p>Votre panier est vide</p>
      <router-link to="/products" class="btn btn-primary">
        Continuer mes achats
      </router-link>
    </div>

    <!-- Actions du panier -->
    <div v-if="cartItems.length > 0" class="cart-actions">
      <!-- Bouton pour étendre les réservations -->
      <button 
        @click="extendReservations" 
        class="btn btn-secondary"
        :disabled="extending"
      >
        <i class="fas fa-clock"></i>
        {{ extending ? 'Extension...' : 'Étendre les réservations' }}
      </button>

      <!-- Bouton pour vider le panier -->
      <button 
        @click="clearCart" 
        class="btn btn-outline-danger"
        :disabled="clearing"
      >
        <i class="fas fa-trash"></i>
        {{ clearing ? 'Vidage...' : 'Vider le panier' }}
      </button>

      <!-- Bouton de checkout -->
      <button 
        @click="proceedToCheckout" 
        class="btn btn-primary checkout-btn"
        :disabled="!canCheckout || checkingOut"
      >
        <i class="fas fa-credit-card"></i>
        {{ checkingOut ? 'Validation...' : `Commander (${formatPrice(totalAmount)})` }}
      </button>
    </div>

    <!-- Modal de confirmation pour vider le panier -->
    <div v-if="showClearConfirm" class="modal-overlay" @click="showClearConfirm = false">
      <div class="modal-content" @click.stop>
        <h3>Vider le panier</h3>
        <p>Êtes-vous sûr de vouloir vider votre panier ? Cette action libérera toutes les réservations.</p>
        <div class="modal-actions">
          <button @click="showClearConfirm = false" class="btn btn-secondary">Annuler</button>
          <button @click="confirmClearCart" class="btn btn-danger">Vider le panier</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'CartWithReservation',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    
    // État réactif
    const cartItems = ref([]);
    const totalAmount = ref(0);
    const hasExpiredItems = ref(false);
    const canCheckout = ref(false);
    const loading = ref(false);
    const extending = ref(false);
    const clearing = ref(false);
    const checkingOut = ref(false);
    const showClearConfirm = ref(false);
    
    // Timer pour mettre à jour les temps restants
    let updateTimer = null;

    // Computed properties
    const userId = computed(() => userStore.user?.id);

    // Méthodes
    const loadCart = async () => {
      if (!userId.value) return;
      
      try {
        loading.value = true;
        const response = await fetch(`/api/cart/${userId.value}`);
        const data = await response.json();
        
        if (response.ok) {
          cartItems.value = data;
          calculateTotal();
          checkExpiredItems();
        } else {
          console.error('Erreur lors du chargement du panier:', data.message);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      } finally {
        loading.value = false;
      }
    };

    const calculateTotal = () => {
      totalAmount.value = cartItems.value.reduce((total, item) => {
        return total + ((item.product?.price || 0) * item.quantity);
      }, 0);
    };

    const checkExpiredItems = () => {
      hasExpiredItems.value = cartItems.value.some(item => 
        item.remainingTime <= 0
      );
      
      canCheckout.value = cartItems.value.length > 0 && 
        cartItems.value.every(item => item.remainingTime > 0);
    };

    const updateQuantity = async (itemId, newQuantity) => {
      if (newQuantity < 1) return;
      
      try {
        const response = await fetch(`/api/cart/${itemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userStore.token}`
          },
          body: JSON.stringify({
            userid: userId.value,
            quantity: newQuantity
          })
        });

        if (response.ok) {
          await loadCart();
        } else {
          const data = await response.json();
          alert(data.message || 'Erreur lors de la mise à jour de la quantité');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error);
        alert('Erreur lors de la mise à jour de la quantité');
      }
    };

    const removeItem = async (itemId) => {
      try {
        const response = await fetch(`/api/cart/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userStore.token}`
          }
        });

        if (response.ok) {
          await loadCart();
        } else {
          const data = await response.json();
          alert(data.message || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    };

    const extendReservations = async () => {
      if (!userId.value) return;
      
      try {
        extending.value = true;
        const response = await fetch(`/api/checkout/cart/${userId.value}/extend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userStore.token}`
          }
        });

        if (response.ok) {
          await loadCart();
          alert('Réservations étendues avec succès !');
        } else {
          const data = await response.json();
          alert(data.message || 'Erreur lors de l\'extension des réservations');
        }
      } catch (error) {
        console.error('Erreur lors de l\'extension des réservations:', error);
        alert('Erreur lors de l\'extension des réservations');
      } finally {
        extending.value = false;
      }
    };

    const clearCart = () => {
      showClearConfirm.value = true;
    };

    const confirmClearCart = async () => {
      if (!userId.value) return;
      
      try {
        clearing.value = true;
        const response = await fetch(`/api/cart/${userId.value}/clear`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userStore.token}`
          }
        });

        if (response.ok) {
          cartItems.value = [];
          totalAmount.value = 0;
          hasExpiredItems.value = false;
          canCheckout.value = false;
          showClearConfirm.value = false;
        } else {
          const data = await response.json();
          alert(data.message || 'Erreur lors du vidage du panier');
        }
      } catch (error) {
        console.error('Erreur lors du vidage du panier:', error);
        alert('Erreur lors du vidage du panier');
      } finally {
        clearing.value = false;
      }
    };

    const proceedToCheckout = async () => {
      if (!userId.value || !canCheckout.value) return;
      
      try {
        checkingOut.value = true;
        
        // Valider le panier
        const validationResponse = await fetch(`/api/checkout/cart/${userId.value}/validate`);
        const validationData = await validationResponse.json();
        
        if (!validationResponse.ok || !validationData.success) {
          alert(validationData.message || 'Erreur lors de la validation du panier');
          await loadCart(); // Recharger pour voir les changements
          return;
        }

        // Rediriger vers le checkout
        router.push(`/checkout/${userId.value}`);
        
      } catch (error) {
        console.error('Erreur lors du checkout:', error);
        alert('Erreur lors du checkout');
      } finally {
        checkingOut.value = false;
      }
    };

    const isExpiringSoon = (item) => {
      return item.remainingTime > 0 && item.remainingTime < 5 * 60 * 1000; // 5 minutes
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price);
    };

    const handleImageError = (event) => {
      event.target.src = '/placeholder-product.jpg';
    };

    const updateRemainingTimes = () => {
      cartItems.value.forEach(item => {
        if (item.reserved_until) {
          const remaining = new Date(item.reserved_until).getTime() - Date.now();
          item.remainingTime = Math.max(0, remaining);
          
          const minutes = Math.floor(remaining / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          item.formattedRemainingTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
      });
      
      checkExpiredItems();
    };

    // Lifecycle hooks
    onMounted(() => {
      loadCart();
      updateTimer = setInterval(updateRemainingTimes, 1000);
    });

    onUnmounted(() => {
      if (updateTimer) {
        clearInterval(updateTimer);
      }
    });

    return {
      cartItems,
      totalAmount,
      hasExpiredItems,
      canCheckout,
      loading,
      extending,
      clearing,
      checkingOut,
      showClearConfirm,
      updateQuantity,
      removeItem,
      extendReservations,
      clearCart,
      confirmClearCart,
      proceedToCheckout,
      isExpiringSoon,
      formatPrice,
      handleImageError
    };
  }
};
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.cart-header h2 {
  margin: 0;
  color: #333;
}

.cart-summary {
  display: flex;
  gap: 20px;
  align-items: center;
}

.item-count {
  color: #666;
  font-size: 14px;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.alert {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cart-item.expiring-soon {
  border: 2px solid #ff6b6b;
  background-color: #fff5f5;
}

.product-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.product-price {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.reservation-timer {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #666;
}

.reservation-timer.expiring {
  color: #ff6b6b;
  font-weight: 600;
}

.reservation-timer .expired {
  color: #e74c3c;
  font-weight: bold;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #007bff;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e74c3c;
  background: white;
  color: #e74c3c;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #e74c3c;
  color: white;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-cart i {
  font-size: 48px;
  margin-bottom: 20px;
  color: #ddd;
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-outline-danger {
  background: white;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.btn-outline-danger:hover:not(:disabled) {
  background: #dc3545;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkout-btn {
  background: #28a745;
  color: white;
}

.checkout-btn:hover:not(:disabled) {
  background: #218838;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.modal-content p {
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 15px;
  }
  
  .quantity-controls,
  .item-total,
  .remove-btn {
    grid-column: 2;
    justify-self: start;
  }
  
  .cart-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 