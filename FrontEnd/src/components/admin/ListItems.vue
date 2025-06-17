<template>
  <div>
    <h2>Dashboard</h2>
    <div class="widgets">
      <div class="widget widget-large">
        <h3>Users Statistics</h3>
        <BarChart :chartData="userChartData" />
      </div>
      <div class="widget widget-medium">
        <h3>Orders Statistics</h3>
        <PieChart :chartData="orderChartData" />
      </div>
      <div class="widget widget-small">
        <h3>Products Statistics</h3>
        <LineChart :chartData="productChartData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BarChart from '@/components/widgets/BarChart.vue';
import PieChart from '@/components/widgets/PieChart.vue';
import LineChart from '@/components/widgets/LineChart.vue';
import { useAnalyticsStore } from '@/stores/analytics';

const analyticsStore = useAnalyticsStore();

onMounted(() => {
  analyticsStore.fetchOverview();
});

const userChartData = computed(() => ({
  labels: ['Utilisateurs'],
  datasets: [{
    label: 'Users',
    backgroundColor: ['#42A5F5'],
    data: [analyticsStore.overview?.userCount || 0],
  }]
}));

const orderChartData = computed(() => ({
  labels: analyticsStore.overview?.orders.map(o => o.status) || [],
  datasets: [{
    label: 'Orders',
    backgroundColor: ['#FF6384', '#FFCD56', '#36A2EB', '#4BC0C0', '#9966FF', '#FF9F40'],
    data: analyticsStore.overview?.orders.map(o => o.count) || [],
  }]
}));

const productChartData = computed(() => ({
  labels: ['Produits'],
  datasets: [{
    label: 'Products',
    borderColor: '#42A5F5',
    data: [analyticsStore.overview?.productCount || 0],
    fill: false,
  }]
}));
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
