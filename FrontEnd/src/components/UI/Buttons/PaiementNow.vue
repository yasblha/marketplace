<template>
    <button class="payNow" @click="payNow">Pay now</button>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const payNow = () => {
    console.log('Payment process initiated');
  };
  
  const componentName = 'PaiementNow';
  
  const setup = () => {
    return {
      payNow,
      componentName
    };
  };
  </script>
  
  <style scoped>
  .payNow {
    background: rgba(35, 133, 109, 1);
    color: white;
    text-align: center;
    padding: 11px;
    width: 100%;
    margin-top: 6px;
    outline: none;
    border: none;
    cursor: pointer;
  }
  
  .payNow:hover {
    background-color: rgba(35, 133, 109, 0.8);
  }
  </style>
  