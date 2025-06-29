<template>
  <div class="product-alerts">
    <h3 class="alerts-title">
      <i class="fas fa-bell"></i>
      Alertes pour ce produit
    </h3>
    
    <div class="alerts-options">
      <!-- Alerte restock -->
      <div class="alert-option">
        <div class="alert-info">
          <h4>Rupture de stock</h4>
          <p>Être notifié quand ce produit sera de nouveau disponible</p>
        </div>
        <button 
          @click="toggleRestockAlert"
          :class="['btn-alert', { active: hasRestockAlert }]"
          :disabled="loading"
        >
          <i class="fas" :class="hasRestockAlert ? 'fa-bell' : 'fa-bell-slash'"></i>
          {{ hasRestockAlert ? 'Alerte active' : 'Activer l\'alerte' }}
        </button>
      </div>

      <!-- Alerte changement de prix -->
      <div class="alert-option">
        <div class="alert-info">
          <h4>Changement de prix</h4>
          <p>Être notifié si le prix de ce produit change</p>
        </div>
        <button 
          @click="togglePriceAlert"
          :class="['btn-alert', { active: hasPriceAlert }]"
          :disabled="loading"
        >
          <i class="fas" :class="hasPriceAlert ? 'fa-bell' : 'fa-bell-slash'"></i>
          {{ hasPriceAlert ? 'Alerte active' : 'Activer l\'alerte' }}
        </button>
      </div>
    </div>

    <!-- Message de succès -->
    <div v-if="successMessage" class="success-message">
      <i class="fas fa-check"></i>
      {{ successMessage }}
    </div>

    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/user';
import axiosInstance from '@/services/api';

interface Alert {
  id: number;
  type: 'restock' | 'price_change';
  product_id: string;
  is_active: boolean;
}

const props = defineProps<{
  productId: string;
}>();

const authStore = useAuthStore();
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const userAlerts = ref<Alert[]>([]);

// Computed properties
const hasRestockAlert = computed(() => {
  return userAlerts.value.some(alert => 
    alert.type === 'restock' && 
    alert.product_id === props.productId && 
    alert.is_active
  );
});

const hasPriceAlert = computed(() => {
  return userAlerts.value.some(alert => 
    alert.type === 'price_change' && 
    alert.product_id === props.productId && 
    alert.is_active
  );
});

// Charger les alertes de l'utilisateur
const loadUserAlerts = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    const response = await axiosInstance.get('/alerts');
    userAlerts.value = response.data.alerts;
  } catch (error) {
    console.error('Erreur lors du chargement des alertes:', error);
  }
};

// Basculer l'alerte de restock
const toggleRestockAlert = async () => {
  if (!authStore.isAuthenticated) {
    errorMessage.value = 'Vous devez être connecté pour créer des alertes';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    if (hasRestockAlert.value) {
      // Désactiver l'alerte
      const alert = userAlerts.value.find(a => 
        a.type === 'restock' && a.product_id === props.productId
      );
      if (alert) {
        await axiosInstance.patch(`/alerts/${alert.id}/toggle`, { is_active: false });
        successMessage.value = 'Alerte de restock désactivée';
      }
    } else {
      // Créer l'alerte
      await axiosInstance.post('/alerts/restock', { product_id: props.productId });
      successMessage.value = 'Alerte de restock activée';
    }
    
    await loadUserAlerts();
  } catch (error: any) {
    console.error('Erreur lors de la modification de l\'alerte:', error);
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la modification de l\'alerte';
  } finally {
    loading.value = false;
  }
};

// Basculer l'alerte de changement de prix
const togglePriceAlert = async () => {
  if (!authStore.isAuthenticated) {
    errorMessage.value = 'Vous devez être connecté pour créer des alertes';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    if (hasPriceAlert.value) {
      // Désactiver l'alerte
      const alert = userAlerts.value.find(a => 
        a.type === 'price_change' && a.product_id === props.productId
      );
      if (alert) {
        await axiosInstance.patch(`/alerts/${alert.id}/toggle`, { is_active: false });
        successMessage.value = 'Alerte de changement de prix désactivée';
      }
    } else {
      // Créer l'alerte
      await axiosInstance.post('/alerts/price-change', { product_id: props.productId });
      successMessage.value = 'Alerte de changement de prix activée';
    }
    
    await loadUserAlerts();
  } catch (error: any) {
    console.error('Erreur lors de la modification de l\'alerte:', error);
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la modification de l\'alerte';
  } finally {
    loading.value = false;
  }
};

// Effacer les messages après un délai
const clearMessages = () => {
  setTimeout(() => {
    successMessage.value = '';
    errorMessage.value = '';
  }, 3000);
};

// Surveiller les changements de messages
watch(successMessage, clearMessages);
watch(errorMessage, clearMessages);

// Initialisation
onMounted(() => {
  loadUserAlerts();
});
</script>

<style scoped>
.product-alerts {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.alerts-title {
  color: #333;
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alerts-title i {
  color: #23a6f0;
}

.alerts-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.alert-info h4 {
  color: #333;
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
}

.alert-info p {
  color: #666;
  font-size: 0.875rem;
  margin: 0;
}

.btn-alert {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-alert:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-alert.active {
  background: #23a6f0;
  color: white;
  border-color: #23a6f0;
}

.btn-alert.active:hover {
  background: #1d94d2;
}

.btn-alert:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message,
.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

@media (max-width: 768px) {
  .alert-option {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .btn-alert {
    justify-content: center;
  }
}
</style> 