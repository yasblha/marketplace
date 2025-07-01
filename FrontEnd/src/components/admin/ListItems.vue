<template>
  <div>
    <h2>Dashboard</h2>
    <div class="widgets">
      <div class="widget widget-large">
        <h3>Statistiques Utilisateurs</h3>
        <BarChart :chartData="userChartData" />
      </div>
      <div class="widget widget-medium">
        <h3>Statistiques Commandes</h3>
        <PieChart :chartData="orderChartData" />
      </div>
      <div class="widget widget-small">
        <h3>Statistiques Produits</h3>
        <LineChart :chartData="productChartData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import BarChart from '@/components/widgets/BarChart.vue';
import PieChart from '@/components/widgets/PieChart.vue';
import LineChart from '@/components/widgets/LineChart.vue';
import { useAnalyticsStore } from '@/stores/analytics';

const analyticsStore = useAnalyticsStore();

onMounted(() => {
  analyticsStore.fetchOverview();
});

watch(() => analyticsStore.overview, (val) => {
  console.info('Aperçu analytics chargé:', val)
})

const userChartData = computed(() => {
  const overview = analyticsStore.overview || {}
  const userCount = typeof overview.userCount === 'number' ? overview.userCount : 0
  if (typeof overview.userCount !== 'number') {
    console.error('overview.userCount n\'est pas un nombre !', overview.userCount)
  }
  const data = {
    labels: ['Utilisateurs'],
    datasets: [{
      label: 'Utilisateurs',
      backgroundColor: ['#42A5F5'],
      data: [userCount],
    }]
  }
  console.info('userChartData:', data)
  return data
});

const orderChartData = computed(() => {
  const overview = analyticsStore.overview || {}
  const orders = Array.isArray(overview.orders) ? overview.orders : []
  if (!Array.isArray(overview.orders)) {
    console.error('overview.orders n\'est pas un tableau !', overview.orders)
  }
  const data = {
    labels: orders.map(o => o.status),
    datasets: [{
      label: 'Commandes',
      backgroundColor: ['#FF6384', '#FFCD56', '#36A2EB', '#4BC0C0', '#9966FF', '#FF9F40'],
      data: orders.map(o => o.count),
    }]
  }
  console.info('orderChartData:', data)
  return data
});

const productChartData = computed(() => {
  const overview = analyticsStore.overview || {}
  const productCount = typeof overview.productCount === 'number' ? overview.productCount : 0
  if (typeof overview.productCount !== 'number') {
    console.error('overview.productCount n\'est pas un nombre !', overview.productCount)
  }
  const data = {
    labels: ['Produits'],
    datasets: [{
      label: 'Produits',
      borderColor: '#42A5F5',
      data: [productCount],
      fill: false,
    }]
  }
  console.info('productChartData:', data)
  return data
});
</script>

<style scoped>
.widgets {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.widget {
  background-color: white;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.widget-large {
  width: 100%;
}

.widget-medium {
  width: 48%;
}

.widget-small {
  width: 30%;
}

.widget h3 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
