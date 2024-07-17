<script setup lang="ts">


import { onMounted } from 'vue';
import { useCartStore } from '@/stores/panier';

const cartStore = useCartStore();

onMounted(() => {
  cartStore.loadCart();
});

</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style >

</style>
