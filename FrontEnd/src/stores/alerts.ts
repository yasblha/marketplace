import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '@/services/api'
import { useAuthStore } from '@/stores/user'

interface Alert {
  id: number;
  type: string;
  category: string;
  product_id: string;
  is_active: boolean;
  created_at: string;
}

export const useAlertStore = defineStore('alerts', () => {
  const authStore = useAuthStore();
  
  // State
  const alerts = ref<Alert[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Getters
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const getUserAlerts = computed(() => alerts.value);
  
  // Actions
  async function fetchUserAlerts() {
    if (!isAuthenticated.value) return;
    
    try {
      loading.value = true;
      error.value = null;
      const response = await axiosInstance.get('/alerts');
      alerts.value = response.data.alerts;
    } catch (err: any) {
      console.error('Error fetching user alerts:', err);
      error.value = err.response?.data?.message || 'Failed to fetch alerts';
    } finally {
      loading.value = false;
    }
  }
  
  async function createAlert(alertData: {type: string; product_id: string; category?: string}) {
    if (!isAuthenticated.value) {
      throw new Error('User must be authenticated to create alerts');
    }
    
    try {
      loading.value = true;
      error.value = null;
      const response = await axiosInstance.post('/alerts', alertData);
      
      // Add the new alert to the local state
      if (response.data.alert) {
        alerts.value.push(response.data.alert);
      }
      
      return response.data;
    } catch (err: any) {
      console.error('Error creating alert:', err);
      error.value = err.response?.data?.message || 'Failed to create alert';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function toggleAlert(alertId: number, isActive: boolean) {
    try {
      loading.value = true;
      error.value = null;
      const response = await axiosInstance.patch(`/alerts/${alertId}/toggle`, { is_active: isActive });
      
      // Update the alert in the local state
      const index = alerts.value.findIndex(a => a.id === alertId);
      if (index !== -1) {
        alerts.value[index].is_active = isActive;
      }
      
      return response.data;
    } catch (err: any) {
      console.error('Error toggling alert:', err);
      error.value = err.response?.data?.message || 'Failed to update alert';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function deleteAlert(alertId: number) {
    try {
      loading.value = true;
      error.value = null;
      await axiosInstance.delete(`/alerts/${alertId}`);
      
      // Remove the alert from the local state
      alerts.value = alerts.value.filter(a => a.id !== alertId);
      
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting alert:', err);
      error.value = err.response?.data?.message || 'Failed to delete alert';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function createPriceChangeAlert(productId: string) {
    try {
      loading.value = true;
      error.value = null;
      
      // Déboguer le payload
      console.log('Envoi d\'une alerte de changement de prix avec product_id:', productId);
      
      const payload = { product_id: productId };
      console.log('Payload de la requête:', payload);
      
      const response = await axiosInstance.post('/alerts/price-change', payload);
      
      console.log('Réponse de la requête:', response.data);
      
      // Si la requête réussit, rafraîchir la liste des alertes
      await fetchUserAlerts();
      
      return response.data;
    } catch (err: any) {
      console.error('Error creating price change alert:', err);
      error.value = err.response?.data?.message || 'Failed to create price change alert';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function createRestockAlert(productId: string) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await axiosInstance.post('/alerts/restock', { 
        product_id: productId 
      });
      
      // Si la requête réussit, rafraîchir la liste des alertes
      await fetchUserAlerts();
      
      return response.data;
    } catch (err: any) {
      console.error('Error creating restock alert:', err);
      error.value = err.response?.data?.message || 'Failed to create restock alert';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function subscribeNewsletter(preferences: any) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await axiosInstance.post('/alerts/newsletter/subscribe', preferences);
      
      return response.data;
    } catch (err: any) {
      console.error('Error subscribing to newsletter:', err);
      error.value = err.response?.data?.message || 'Failed to subscribe to newsletter';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function unsubscribeNewsletter() {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await axiosInstance.post('/alerts/newsletter/unsubscribe');
      
      return response.data;
    } catch (err: any) {
      console.error('Error unsubscribing from newsletter:', err);
      error.value = err.response?.data?.message || 'Failed to unsubscribe from newsletter';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  // Initialize
  if (isAuthenticated.value) {
    fetchUserAlerts();
  }
  
  return {
    // State
    alerts,
    loading,
    error,
    
    // Getters
    getUserAlerts,
    
    // Actions
    fetchUserAlerts,
    createAlert,
    toggleAlert,
    deleteAlert,
    createPriceChangeAlert,
    createRestockAlert,
    subscribeNewsletter,
    unsubscribeNewsletter
  }
});
