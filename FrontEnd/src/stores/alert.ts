import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/user';
import axiosInstance from "@/services/api";

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
            const response = await axiosInstance.post(`/alerts/subscribe/${userId}/${productId}`);
            alerts.value.push(response.data);
            console.log('Subscribed to alert:', response.data);
        } catch (error) {
            console.error('Error subscribing to alert:', error);
            throw new Error('Failed to subscribe to alert');
        }
    };

    const unsubscribeFromAlert = async (alertId: string): Promise<void> => {
        try {
            const userId = authStore.user?.id;
            if (!userId) {
                throw new Error('User not authenticated');
            }
            await axiosInstance.post(`/alerts/unsubscribe/${userId}/${alertId}`);
            alerts.value = alerts.value.filter(alert => alert.id !== alertId);
            console.log(`Alert with ID ${alertId} unsubscribed`);
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
