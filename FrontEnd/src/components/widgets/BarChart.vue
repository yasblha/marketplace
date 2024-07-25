<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js';

const props = defineProps({
  chartData: Object
});

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (canvas.value !== null) {
    new Chart(canvas.value, {
      type: 'bar',
      data: props.chartData,
    });
  }
});
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>