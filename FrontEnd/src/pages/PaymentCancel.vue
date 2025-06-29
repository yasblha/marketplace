<template>
    <div>
      <h1>Payment Cancelled</h1>
      <p>Your payment was cancelled. Please try again.</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue'
  import { useCartStore } from '@/stores/panier'

  const cart = useCartStore()

  onMounted(() => {
    cart.restoreSnapshot()
  })
  </script>