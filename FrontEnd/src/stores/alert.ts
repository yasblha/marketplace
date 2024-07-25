import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/user';
import axiosInstance from "@/services/api";

// Utility function to denormalize MongoDB IDs for PostgreSQL
const removeLeftZeros = (str: string) => str.replace(/^0+/, '');

export interface Alert {
    id: string;
    alert_type: string;
    status: string;
    productId: string;
    userId: string;
}

export const useAlertStore = defineStore('alert', () => {
    const alerts = ref<Alert[]>([]);
    const authStore = useAuthStore();

    const subscribeToAlert = async (productId: string): Promise<void> => {
        try {
            const userId = authStore.user?.id;
            if (!userId) {
                throw new Error('User not authenticated');
            }
            // Denormalize the productId
            const normalizedProductId = removeLeftZeros(productId);
            console.log('Normalized product ID:', normalizedProductId);
            const response = await axiosInstance.post(`/alerts/subscribe/${userId}/${normalizedProductId}`);
            alerts.value.push(response.data);
            console.log('Subscribed to alert:', response.data);
        } catch (error) {
            console.error('Error subscribing to alert:', error);
            throw new Error('Failed to subscribe to alert');
        }
    };

    const unsubscribeFromAlert = async (productId: string): Promise<void> => {
        try {
          const userId = authStore.user?.id;
          if (!userId) {
            throw new Error('User not authenticated');
          }
          // Denormalize the productId
          const normalizedProductId = removeLeftZeros(productId);
          await axiosInstance.post(`/alerts/unsubscribe/${userId}/${normalizedProductId}`);
          alerts.value = alerts.value.filter(alert => alert.productId !== normalizedProductId);
          console.log(`Alert for product ID ${normalizedProductId} unsubscribed`);
        } catch (error) {
          console.error('Error unsubscribing from alert:', error);
          throw new Error('Failed to unsubscribe from alert');
        }
      };
    
      const fetchAlerts = async (): Promise<void> => {
        try {
          const userId = authStore.user?.id;
          if (!userId) {
            throw new Error('User not authenticated');
          }
          const response = await axiosInstance.get(`/alerts/${userId}`);
          alerts.value = response.data;
          console.log('Fetched alerts:', alerts.value);
        } catch (error) {
          console.error('Error fetching alerts:', error);
          throw new Error('Failed to fetch alerts');
        }
      };
    

    return {
        alerts,
        subscribeToAlert,
        unsubscribeFromAlert,
        fetchAlerts
    };
});
