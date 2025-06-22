<template>
  <div class="orders-section">
    <div class="section-header">
      <h2 class="section-title">
        <i class="fas fa-shopping-bag"></i> Mes Commandes
      </h2>
      <div class="filters">
        <select v-model="statusFilter" class="filter-select">
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente de paiement</option>
          <option value="en_cours">En cours de traitement</option>
          <option value="livree">Livrée</option>
          <option value="annulee">Annulée</option>
        </select>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-gray-600">Chargement de vos commandes...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="error" class="text-center py-8 text-red-500">
      <p>{{ error }}</p>
      <button @click="loadUserOrders" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Réessayer
      </button>
    </div>

    <!-- Aucune commande -->
    <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
      <div class="bg-gray-100 p-8 rounded-lg">
        <i class="fas fa-box-open text-5xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-700 mb-2">Aucune commande trouvée</h3>
        <p class="text-gray-500 mb-4">Vous n'avez pas encore passé de commande.</p>
        <router-link 
          to="/products" 
          class="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Découvrir nos produits
        </router-link>
      </div>
    </div>

    <!-- Liste des commandes -->
    <div v-else class="orders-list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <h3>Commande #{{ order.id }}</h3>
            <span class="order-date">{{ formatDate(order.dateOrder) }}</span>
          </div>
          <div class="order-status" :class="getStatusClass(order.statusOrder)">
            <i class="fas mr-2" :class="getStatusIcon(order.statusOrder)"></i>
            {{ getStatusLabel(order.statusOrder) }}
          </div>
        </div>

        <div class="order-content">
          <div class="order-items">
            <div v-for="item in order.DetailsCommandes" :key="item.id" class="order-item">
              <img :src="getProductImage(item)" :alt="item.productName" class="item-image">
              <div class="item-details">
                <h4>{{ item.productName || 'Produit sans nom' }}</h4>
                <p class="item-price">{{ formatPrice(Number(item.unitPrice)) }} x {{ item.quantity }}</p>
              </div>
              <div class="item-total">
                {{ formatPrice(Number(item.unitPrice) * item.quantity) }}
              </div>
            </div>
          </div>

          <div class="order-summary">
            <div class="summary-row">
              <span>Sous-total</span>
              <span>{{ formatPrice(calculateSubtotal(order)) }}</span>
            </div>
            <div class="summary-row">
              <span>Livraison</span>
              <span>{{ formatPrice(0) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ formatPrice(calculateTotal(order)) }}</span>
            </div>
          </div>
        </div>

        <div class="order-actions">
          <button @click="viewOrderDetails(order)" class="btn-action">
            <i class="fas fa-eye"></i> Détails
          </button>
          
          <!-- Bouton pour reprendre une commande non terminée -->
          <button 
            v-if="['en_attente', 'en_attente_de_paiement'].includes(order.statusOrder)" 
            @click="resumeOrder(order)" 
            class="btn-action bg-blue-600 text-white hover:bg-blue-700"
          >
            <i class="fas fa-sync-alt mr-1"></i> Reprendre
          </button>
          
          <button 
            v-if="['en_attente', 'en_attente_de_paiement', 'en_preparation'].includes(order.statusOrder)" 
            @click="cancelOrder(order)" 
            class="btn-action bg-red-600 text-white hover:bg-red-700"
          >
            <i class="fas fa-times mr-1"></i> Annuler
          </button>
          
          <button 
            v-if="['en_cours', 'en_cours_de_livraison', 'en_preparation'].includes(order.statusOrder)" 
            @click="trackOrder(order)" 
            class="btn-action bg-green-600 text-white hover:bg-green-700"
          >
            <i class="fas fa-truck mr-1"></i> Suivre
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de détails de commande -->
    <div v-if="selectedOrder" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Détails de la commande #{{ selectedOrder.id }}</h3>
          <button @click="selectedOrder = null" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="order-timeline">
            <div class="timeline-item" :class="{ active: true }">
              <i class="fas fa-shopping-cart"></i>
              <div class="timeline-content">
                <h4>Commande passée</h4>
                <p>{{ formatDate(selectedOrder.date) }}</p>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: selectedOrder.status !== 'en_attente' }">
              <i class="fas fa-check-circle"></i>
              <div class="timeline-content">
                <h4>Commande confirmée</h4>
                <p>{{ selectedOrder.confirmationDate || 'En attente' }}</p>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: ['en_cours', 'livree'].includes(selectedOrder.status) }">
              <i class="fas fa-box"></i>
              <div class="timeline-content">
                <h4>En préparation</h4>
                <p>{{ selectedOrder.preparationDate || 'En attente' }}</p>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: selectedOrder.status === 'livree' }">
              <i class="fas fa-truck"></i>
              <div class="timeline-content">
                <h4>En livraison</h4>
                <p>{{ selectedOrder.shippingDate || 'En attente' }}</p>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: selectedOrder.status === 'livree' }">
              <i class="fas fa-home"></i>
              <div class="timeline-content">
                <h4>Livrée</h4>
                <p>{{ selectedOrder.deliveryDate || 'En attente' }}</p>
              </div>
            </div>
          </div>

          <div class="shipping-info">
            <h4>Adresse de livraison</h4>
            <p>{{ selectedOrder.shippingAddress }}</p>
          </div>

          <div class="payment-info">
            <h4>Informations de paiement</h4>
            <p>Méthode : {{ selectedOrder.paymentMethod }}</p>
            <p>Transaction : {{ selectedOrder.transactionId }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useOrderStore } from '@/stores/Commande';
import { useAuthStore } from '@/stores/user';
import { useRouter } from 'vue-router';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  date: string;
  status: 'en_attente' | 'en_cours' | 'livree' | 'annulee';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  confirmationDate?: string;
  preparationDate?: string;
  shippingDate?: string;
  deliveryDate?: string;
  shippingAddress: string;
  paymentMethod: string;
  transactionId: string;
}

const router = useRouter();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const statusFilter = ref('all');
const selectedOrder = ref<Order | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Charger les commandes de l'utilisateur
const loadUserOrders = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    // Vérifier que l'utilisateur est connecté
    if (!authStore.user || !authStore.user.id) {
      error.value = 'Veuillez vous connecter pour voir vos commandes';
      return;
    }
    
    // Charger les commandes de l'utilisateur connecté
    await orderStore.getOrderByUserId(authStore.user.id);
    
  } catch (err) {
    console.error('Erreur lors du chargement des commandes:', err);
    error.value = 'Impossible de charger vos commandes. Veuillez réessayer plus tard.';
  } finally {
    isLoading.value = false;
  }
};

// Au montage du composant
onMounted(() => {
  loadUserOrders();
});

// Commandes filtrées selon le statut
const filteredOrders = computed(() => {
  // Utiliser directement les commandes du store car elles sont déjà filtrées par utilisateur
  const orders = orderStore.orders || [];
  
  if (statusFilter.value === 'all') return orders;
  
  return orders.filter(order => 
    order.statusOrder && 
    order.statusOrder.toLowerCase().includes(statusFilter.value.toLowerCase())
  );
});

// Reprendre une commande non terminée
const resumeOrder = async (order: Order) => {
  try {
    // Vérifier si la commande peut être reprise
    if (['en_attente', 'en_attente_de_paiement'].includes(order.statusOrder)) {
      // Rediriger vers la page de paiement avec l'ID de commande
      await router.push({ 
        name: 'Checkout', 
        query: { orderId: order.id } 
      });
    }
  } catch (err) {
    console.error('Erreur lors de la reprise de la commande:', err);
  }
};

// Annuler une commande
const cancelOrder = async (order: Order) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
    try {
      await orderStore.updateOrder(order.id, { statusOrder: 'annulee' });
      // Recharger les commandes après annulation
      await loadUserOrders();
    } catch (err) {
      console.error('Erreur lors de l\'annulation de la commande:', err);
      alert('Une erreur est survenue lors de l\'annulation de la commande');
    }
  }
};

// Suivre une commande
const trackOrder = (order: Order) => {
  // Implémenter le suivi de livraison
  alert('Fonctionnalité de suivi de livraison à implémenter');
};

// Formatage de la date
const formatDate = (dateString: string | Date) => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('fr-FR', options);
  } catch (e) {
    return 'Date inconnue';
  }
};

// Formatage du prix
const formatPrice = (price: number) => {
  if (isNaN(price)) return '0,00 €';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

// Calculer le sous-total d'une commande
const calculateSubtotal = (order: any) => {
  if (!order.DetailsCommandes || !order.DetailsCommandes.length) return 0;
  return order.DetailsCommandes.reduce((total: number, item: any) => {
    const price = Number(item.unitPrice) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);
};

// Calculer le total d'une commande
const calculateTotal = (order: any) => {
  const subtotal = calculateSubtotal(order);
  // Pour l'instant, on ne gère pas les frais de livraison
  return subtotal;
};

// Obtenir l'image d'un produit
const getProductImage = (item: any) => {
  if (item.images && item.images.length > 0) {
    return item.images[0];
  }
  return 'https://via.placeholder.com/100';
};

// Obtenir la classe de statut
const getStatusClass = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('en_attente')) return 'bg-yellow-100 text-yellow-800';
  if (statusLower.includes('en_cours')) return 'bg-blue-100 text-blue-800';
  if (statusLower.includes('livr')) return 'bg-green-100 text-green-800';
  if (statusLower.includes('annul') || statusLower.includes('refus')) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

// Obtenir l'icône de statut
const getStatusIcon = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('en_attente')) return 'fa-clock';
  if (statusLower.includes('en_cours')) return 'fa-truck';
  if (statusLower.includes('livr')) return 'fa-check-circle';
  if (statusLower.includes('annul') || statusLower.includes('refus')) return 'fa-times-circle';
  return 'fa-question-circle';
};

// Obtenir le libellé de statut
const getStatusLabel = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('en_attente')) return 'En attente de paiement';
  if (statusLower.includes('en_cours')) return 'En cours de traitement';
  if (statusLower.includes('livr')) return 'Livrée';
  if (statusLower.includes('annul') || statusLower.includes('refus')) return 'Annulée';
  return status;
};

// Afficher les détails de la commande
const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order;
  alert('Fonctionnalité de suivi de livraison à implémenter');
};
</script>

<style scoped>
.orders-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  color: #333;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.section-title i {
  color: #23a6f0;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #333;
  cursor: pointer;
}

.orders-list {
  display: grid;
  gap: 1.5rem;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.order-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.order-info h3 {
  color: #333;
  margin: 0;
  font-size: 1.2rem;
}

.order-date {
  color: #666;
  font-size: 0.9rem;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.order-status.en_attente {
  background: #fff3e0;
  color: #f57c00;
}

.order-status.en_cours {
  background: #e3f2fd;
  color: #1976d2;
}

.order-status.livree {
  background: #e8f5e9;
  color: #388e3c;
}

.order-status.annulee {
  background: #ffebee;
  color: #d32f2f;
}

.order-content {
  padding: 1.5rem;
}

.order-items {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  color: #333;
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.item-price {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.item-total {
  color: #333;
  font-weight: 500;
}

.order-summary {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #666;
}

.summary-row.total {
  border-top: 1px solid #ddd;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  color: #333;
  font-weight: 500;
}

.order-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-details,
.btn-cancel,
.btn-track {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-details {
  background: #23a6f0;
  color: #fff;
  border: none;
}

.btn-details:hover {
  background: #1d94d2;
}

.btn-cancel {
  background: #fff;
  border: 1px solid #dc3545;
  color: #dc3545;
}

.btn-cancel:hover {
  background: #dc3545;
  color: #fff;
}

.btn-track {
  background: #fff;
  border: 1px solid #28a745;
  color: #28a745;
}

.btn-track:hover {
  background: #28a745;
  color: #fff;
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
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: #333;
  margin: 0;
  font-size: 1.5rem;
}

.btn-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s;
}

.btn-close:hover {
  color: #dc3545;
}

.modal-body {
  padding: 1.5rem;
}

.order-timeline {
  margin-bottom: 2rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 12px;
  top: 40px;
  bottom: 0;
  width: 2px;
  background: #ddd;
}

.timeline-item i {
  width: 24px;
  height: 24px;
  background: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  z-index: 1;
}

.timeline-item.active i {
  background: #23a6f0;
  border-color: #23a6f0;
  color: #fff;
}

.timeline-content h4 {
  color: #333;
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.timeline-content p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.shipping-info,
.payment-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.shipping-info h4,
.payment-info h4 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.shipping-info p,
.payment-info p {
  color: #666;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .order-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
}

  .order-item {
    flex-direction: column;
    text-align: center;
  }

  .item-total {
    margin-top: 0.5rem;
  }

  .order-footer {
    flex-direction: column;
  }

  .btn-details,
  .btn-cancel,
  .btn-track {
    width: 100%;
    justify-content: center;
  }
}
</style>
