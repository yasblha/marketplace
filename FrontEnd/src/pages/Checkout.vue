<template>
  <div class="checkout-container">
    <component :is="steps[currentStep]" @next-step="handleNextStep"></component>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ShippingInformations from "@/components/Payment/ShippingInformations.vue";
import ShippingOptions from '@/components/Payment/ShippingOptions.vue';
import Payment from '@/components/Payment/Paiment.vue';

const steps = {
  ShippingInformations,
  ShippingOptions,
  Payment
};

const currentStep = ref('ShippingInformations');

const handleNextStep = (nextStep) => {
  currentStep.value = nextStep;
};
</script>

<style scoped>
.checkout-container {
  padding: 20px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
