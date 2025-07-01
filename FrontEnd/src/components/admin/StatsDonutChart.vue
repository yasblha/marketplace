<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="font-semibold mb-2">Répartition des catégories</h3>
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps<{ data: number[], labels: string[], colors?: string[] }>()
const chartData = {
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: props.colors || [
        '#2563eb', '#10b981', '#f59e42', '#f43f5e', '#a21caf', '#fbbf24', '#0ea5e9'
      ],
      borderWidth: 2
    }
  ]
}
const chartOptions = {
  cutout: '70%',
  plugins: {
    legend: { position: 'bottom' },
    tooltip: { enabled: true }
  }
}
</script> 