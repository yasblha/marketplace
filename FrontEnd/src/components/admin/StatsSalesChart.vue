<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="font-semibold mb-2">Évolution des ventes</h3>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps<{ data: number[], labels: string[] }>()
const chartData = {
  labels: props.labels,
  datasets: [
    {
      label: 'Ventes',
      data: props.data,
      fill: true,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.1)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#2563eb',
    }
  ]
}
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true }
  }
}
</script> 