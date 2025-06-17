<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import type { ChartItem, ChartData, Point } from 'chart.js'
import { ref, onMounted } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title);

const props = defineProps<{ chartData: ChartData<'line', (number | Point | null)[], unknown> }>();

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (canvas.value) {
    new Chart(canvas.value as ChartItem, {
      type: 'line',
      data: props.chartData
    });
  }
});
</script>
