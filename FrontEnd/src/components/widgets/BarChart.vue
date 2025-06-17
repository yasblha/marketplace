<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import type { ChartItem } from 'chart.js'
import { ref, onMounted } from 'vue';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title);

const props = defineProps({
  chartData: Object
});

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (canvas.value) {
    new Chart(canvas.value as ChartItem, {
      type: 'bar',
      data: props.chartData
    });
  }
});
</script>
