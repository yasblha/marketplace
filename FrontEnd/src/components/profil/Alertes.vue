<template>
  <div class="alerts-section">
    <h2 class="section-title">
      <i class="fas fa-bell"></i> Mes Alertes Email
    </h2>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement des alertes...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="alerts-content">
      <!-- Newsletter -->
      <div class="alert-card">
        <div class="alert-header">
          <div class="alert-info">
            <h3>Newsletter</h3>
            <p>Recevez nos meilleures offres et nouveautés</p>
          </div>
          <div class="alert-toggle">
            <input 
              type="checkbox" 
              :checked="hasNewsletterAlert"
              @change="toggleNewsletter"
              id="newsletter-toggle"
            />
            <label for="newsletter-toggle" class="toggle-label"></label>
          </div>
        </div>
        <div class="alert-description">
          <i class="fas fa-envelope"></i>
          <span>Recevez nos offres spéciales, promotions et nouveautés directement dans votre boîte mail</span>
        </div>
      </div>

      <!-- Alertes nouveaux produits par catégorie -->
      <div class="alert-card">
        <div class="alert-header">
          <div class="alert-info">
            <h3>Nouveaux produits</h3>
            <p>Soyez informé des nouveaux produits</p>
          </div>
        </div>
        <div class="alert-description">
          <i class="fas fa-star"></i>
          <span>Recevez une notification quand de nouveaux produits sont ajoutés</span>
        </div>
        <div class="category-alerts">
          <div class="category-selector">
            <label for="category-select">Catégorie :</label>
            <select v-model="selectedCategory" id="category-select">
              <option value="">Toutes les catégories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <button 
              @click="createNewProductAlert"
              :disabled="!selectedCategory || hasCategoryAlert(selectedCategory)"
              class="btn-add-alert"
            >
              <i class="fas fa-plus"></i>
              Ajouter l'alerte
            </button>
          </div>
          
          <div v-if="categoryAlerts.length > 0" class="category-list">
            <h4>Alertes actives :</h4>
            <div v-for="alert in categoryAlerts" :key="alert.id" class="category-alert-item">
              <span>{{ alert.category }}</span>
              <button @click="deleteAlert(alert.id)" class="btn-remove-alert">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Alertes restock -->
      <div class="alert-card">
        <div class="alert-header">
          <div class="alert-info">
            <h3>Alertes restock</h3>
            <p>Soyez informé quand un produit est de nouveau en stock</p>
          </div>
        </div>
        <div class="alert-description">
          <i class="fas fa-boxes"></i>
          <span>Recevez une notification quand un produit en rupture de stock est de nouveau disponible</span>
        </div>
        <div v-if="restockAlerts.length > 0" class="restock-alerts">
          <h4>Produits surveillés :</h4>
          <div v-for="alert in restockAlerts" :key="alert.id" class="restock-alert-item">
            <span>{{ getProductName(alert.product_id) }}</span>
            <button @click="deleteAlert(alert.id)" class="btn-remove-alert">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Alertes changement de prix -->
      <div class="alert-card">
        <div class="alert-header">
          <div class="alert-info">
            <h3>Alertes prix</h3>
            <p>Soyez informé des changements de prix</p>
          </div>
        </div>
        <div class="alert-description">
          <i class="fas fa-tags"></i>
          <span>Recevez une notification quand le prix d'un produit change</span>
        </div>
        <div v-if="priceAlerts.length > 0" class="price-alerts">
          <h4>Produits surveillés :</h4>
          <div v-for="alert in priceAlerts" :key="alert.id" class="price-alert-item">
            <span>{{ getProductName(alert.product_id) }}</span>
            <button @click="deleteAlert(alert.id)" class="btn-remove-alert">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Résumé des alertes -->
      <div class="alerts-summary">
        <h3>Résumé de vos alertes</h3>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalAlerts }}</span>
            <span class="stat-label">Alertes actives</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ activeAlerts }}</span>
            <span class="stat-label">Alertes activées</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/user';
import { useProductStore } from '@/stores/products';
import axiosInstance from '@/services/api';

interface Alert {
  id: number;
  type: 'new_product' | 'restock' | 'price_change' | 'newsletter';
  category?: string;
  product_id?: string;
  is_active: boolean;
  created_at: string;
  last_sent?: string;
}

const authStore = useAuthStore();
const productStore = useProductStore();

const loading = ref(false);
const error = ref('');
const alerts = ref<Alert[]>([]);
const selectedCategory = ref('');

// Charger les alertes
const loadAlerts = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await axiosInstance.get('/alerts');
    alerts.value = response.data.alerts;
  } catch (err: any) {
    console.error('Erreur lors du chargement des alertes:', err);
    error.value = err.response?.data?.message || 'Erreur lors du chargement des alertes';
  } finally {
    loading.value = false;
  }
};

// Computed properties
const hasNewsletterAlert = computed(() => {
  return alerts.value.some(alert => alert.type === 'newsletter' && alert.is_active);
});

const categoryAlerts = computed(() => {
  return alerts.value.filter(alert => alert.type === 'new_product' && alert.is_active);
});

const restockAlerts = computed(() => {
  return alerts.value.filter(alert => alert.type === 'restock' && alert.is_active);
});

const priceAlerts = computed(() => {
  return alerts.value.filter(alert => alert.type === 'price_change' && alert.is_active);
});

const totalAlerts = computed(() => alerts.value.length);
const activeAlerts = computed(() => alerts.value.filter(alert => alert.is_active).length);

const categories = computed(() => {
  return [...new Set(productStore.products.map(p => p.category).filter(Boolean))].sort();
});

// Méthodes
const toggleNewsletter = async () => {
  try {
    if (hasNewsletterAlert.value) {
      await axiosInstance.post('/alerts/newsletter/unsubscribe');
    } else {
      await axiosInstance.post('/alerts/newsletter/subscribe');
    }
    await loadAlerts();
  } catch (err: any) {
    console.error('Erreur lors de la modification de l\'abonnement newsletter:', err);
    error.value = err.response?.data?.message || 'Erreur lors de la modification de l\'abonnement';
  }
};

const hasCategoryAlert = (category: string) => {
  return categoryAlerts.value.some(alert => alert.category === category);
};

const createNewProductAlert = async () => {
  if (!selectedCategory.value) return;
  
  try {
    await axiosInstance.post('/alerts/new-products', {
      category: selectedCategory.value
    });
    await loadAlerts();
    selectedCategory.value = '';
  } catch (err: any) {
    console.error('Erreur lors de la création de l\'alerte:', err);
    error.value = err.response?.data?.message || 'Erreur lors de la création de l\'alerte';
  }
};

const deleteAlert = async (alertId: number) => {
  try {
    await axiosInstance.delete(`/alerts/${alertId}`);
    await loadAlerts();
  } catch (err: any) {
    console.error('Erreur lors de la suppression de l\'alerte:', err);
    error.value = err.response?.data?.message || 'Erreur lors de la suppression de l\'alerte';
  }
};

const getProductName = (productId: string) => {
  const product = productStore.products.find(p => p._id === productId);
  return product ? product.name : 'Produit inconnu';
};

// Initialisation
onMounted(async () => {
  await Promise.all([
    loadAlerts(),
    productStore.fetchProducts()
  ]);
});
</script>

<style scoped>
.alerts-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.section-title {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #23a6f0;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.loading i {
  margin-right: 0.5rem;
}

.error {
  background: #fee;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.alerts-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.alert-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.alert-info h3 {
  color: #333;
  font-size: 1.2rem;
  margin: 0 0 0.25rem 0;
}

.alert-info p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.alert-toggle {
  position: relative;
  flex-shrink: 0;
}

.alert-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: relative;
  display: block;
  width: 44px;
  height: 24px;
  background: #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-label:before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.alert-toggle input:checked + .toggle-label {
  background: #23a6f0;
}

.alert-toggle input:checked + .toggle-label:before {
  transform: translateX(20px);
}

.alert-description {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.alert-description i {
  color: #23a6f0;
  width: 16px;
}

.category-alerts,
.restock-alerts,
.price-alerts {
  margin-top: 1rem;
}

.category-alerts h4,
.restock-alerts h4,
.price-alerts h4 {
  color: #333;
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
}

.category-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-selector label {
  color: #333;
  font-weight: 500;
}

.category-selector select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #333;
  min-width: 150px;
}

.btn-add-alert {
  background: #23a6f0;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: background 0.3s;
}

.btn-add-alert:hover:not(:disabled) {
  background: #1d94d2;
}

.btn-add-alert:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.category-alert-item,
.restock-alert-item,
.price-alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.btn-remove-alert {
  background: #dc3545;
  color: #fff;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background 0.3s;
}

.btn-remove-alert:hover {
  background: #c82333;
}

.alerts-summary {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.alerts-summary h3 {
  color: #333;
  margin: 0 0 1rem 0;
  text-align: center;
}

.summary-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #23a6f0;
}

.stat-label {
  color: #666;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .alert-header {
    flex-direction: column;
    gap: 1rem;
  }

  .category-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .summary-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style> 