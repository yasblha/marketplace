<template>
  <header>
    <div class="wrapper">
      <h1>Welcome to Alert System</h1>
    </div>
  </header>

  <main>
    <SubscriptionForm />
    <UnsubscriptionForm />
  </main>
</template>

<script setup>
import SubscriptionForm from './components/SubsctiptionForm.vue'
import UnsubscriptionForm from './components/UnsubscriptionForm.vue'
</script>

<style scoped>
header {
  line-height: 1.5;
}

main {
  padding: 20px;
}
</style>
