<script setup lang="ts">

import { createApp } from 'vue';
import App from './App.vue';
import { onMounted } from 'vue';
import { useCartStore } from '@/stores/panier';
import NavigationBar from "@/components/UI/NavigationBar.vue";
import AuthModal from "@/components/common/AuthModal.vue";
import { useAuthModalStore } from '@/stores/authModale';
import {useRoute} from "vue-router";


const route = useRoute();
const authModalStore = useAuthModalStore();

const options = {
  pk: process.env.STRIPE_PUBLIC_KEY,
  // stripeAccount: process.env.VUE_APP_STRIPE_ACCOUNT,
  // apiVersion: process.env.VUE_APP_API_VERSION,
  // locale: process.env.VUE_APP_LOCALE,
};

// const app = createApp(App);
// app.use(VueStripe, options);
// app.mount('#app');
onMounted(() => {
  useCartStore().loadCart();
});

</script>

<template>
  <div id="app">
    <NavigationBar v-if="!route.path.startsWith('/admin')" />

    <router-view></router-view>
    <AuthModal :isVisible="authModalStore.isVisible" @close="authModalStore.closeModal" />

  </div>
</template>

<style >

</style>
