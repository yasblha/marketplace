import { defineStore } from 'pinia';
import axiosInstance from '@/services/api';
import { ref } from 'vue';

export interface OverviewData {
  userCount: number;
  productCount: number;
  totalOrders: number;
  orders: { status: string; count: number }[];
  totalRevenue: number;
}

export const useAnalyticsStore = defineStore('analytics', () => {
  const overview = ref<OverviewData | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchOverview = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await axiosInstance.get('/analytics/overview');
      overview.value = data;
    } catch (err) {
      error.value = 'Erreur lors du chargement des statistiques';
    } finally {
      isLoading.value = false;
    }
  };

  return { overview, isLoading, error, fetchOverview };
});
