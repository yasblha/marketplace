<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="font-semibold mb-2">Commandes par mois</h3>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps<{ data: number[], labels: string[] }>()
const chartData = {
  labels: props.labels,
  datasets: [
    {
      label: 'Commandes',
      data: props.data,
      backgroundColor: '#10b981',
      borderRadius: 8,
      barThickness: 24
    }
  ]
}
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true }
  }
}
</script> 