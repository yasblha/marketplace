<template>
  <div>
    <NavigationBar v-if="!isAdminPage" />

    <router-view />

    <AuthModal v-model:isVisible="authModalStore.isVisible" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute }          from 'vue-router'

import NavigationBar         from '@/components/UI/NavigationBar.vue'
import AuthModal             from '@/components/common/AuthModal.vue'

import { useCartStore }      from '@/stores/panier'
import { useAuthModalStore } from '@/stores/authModale'

const cartStore      = useCartStore()
const authModalStore = useAuthModalStore()
const route          = useRoute()

const isAdminPage = computed(() => route.path.startsWith('/admin'))

onMounted(async () => {
  await cartStore.loadCart?.()
})
</script>

<style scoped></style>
