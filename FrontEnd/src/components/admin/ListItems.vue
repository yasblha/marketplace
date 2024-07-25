<template>
  <div>
    <div class="flex justify-between w-full">
      <span class="flex flex-col">
        <span class="text-xl font-bold text-text-100">Tableau de bord</span>
        <span class="text-md text-text-200">Surveillez vos revenus de ventes ici.</span>
      </span>
      <Button class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white" @click="openModal">
        Ajouter Widget
      </Button>
    </div>
    <div class="flex flex-col mt-6 gap-6">
      <GridLayout
          :layout="layout"
          :col-num="12"
          :row-height="30"
          :is-draggable="true"
          :is-resizable="true"
          :vertical-compact="true"
          :use-css-transforms="true"
          @layout-updated="updateLayout"
      >
        <GridItem
            v-for="item in layout"
            :key="item.i"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
        >
          <component :is="getChartComponent(item.type)" :chartData="getChartData(item.type)" @remove="removeWidget(item.i)" />
        </GridItem>
      </GridLayout>
    </div>
    <WidgetModalComponent v-if="isModalOpen" @close="closeModal" @add-widget="addWidget" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GridLayout, { GridItem } from 'vue-grid-layout';
import BarChart from '@/components/widgets/BarChart.vue';
import PieChart from '@/components/widgets/PieChart.vue';
import LineChart from '@/components/widgets/LineChart.vue';
import Button from '@/components/widgets/Button.vue';
import WidgetModalComponent from '@/components/widgets/widgetModalComponent.vue';

const isModalOpen = ref(false);
const layout = ref([
  { i: '0', x: 0, y: 0, w: 4, h: 6, type: 'bar' },
  { i: '1', x: 4, y: 0, w: 4, h: 6, type: 'pie' },
  { i: '2', x: 8, y: 0, w: 4, h: 6, type: 'line' }
]);

const userChartData = ref({
  labels: ['Active Users', 'Inactive Users'],
  datasets: [{
    label: 'Users',
    backgroundColor: ['#42A5F5', '#66BB6A'],
    data: [30, 10],
  }]
});
const orderChartData = ref({
  labels: ['Completed', 'Pending', 'Cancelled'],
  datasets: [{
    label: 'Orders',
    backgroundColor: ['#FF6384', '#FFCD56', '#36A2EB'],
    data: [50, 20, 10],
  }]
});
const productChartData = ref({
  labels: ['Electronics', 'Fashion', 'Home'],
  datasets: [{
    label: 'Products',
    borderColor: '#42A5F5',
    data: [40, 20, 30],
    fill: false,
  }]
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const getChartComponent = (type) => {
  switch (type) {
    case 'bar':
      return BarChart;
    case 'pie':
      return PieChart;
    case 'line':
      return LineChart;
    default:
      return null;
  }
};

const getChartData = (type) => {
  switch (type) {
    case 'bar':
      return userChartData.value;
    case 'pie':
      return orderChartData.value;
    case 'line':
      return productChartData.value;
    default:
      return null;
  }
};

const updateLayout = (newLayout) => {
  layout.value = newLayout;
};

const removeWidget = (i) => {
  layout.value = layout.value.filter(item => item.i !== i);
};

const addWidget = (widget) => {
  const newWidget = {
    i: (layout.value.length).toString(),
    x: widget.x,
    y: widget.y,
    w: widget.w,
    h: widget.h,
    type: widget.type,
  };
  layout.value.push(newWidget);
};
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