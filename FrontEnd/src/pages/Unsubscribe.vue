<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="bg-white shadow rounded-lg p-8 max-w-md w-full text-center">
      <h1 class="text-2xl font-bold mb-4">Désinscription Newsletter</h1>
      <p class="mb-4">Entrez votre email pour vous désinscrire de la newsletter.</p>
      <form @submit.prevent="unsubscribe" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Votre adresse email"
          class="border rounded px-4 py-2 w-full"
          required
          :disabled="loading"
        />
        <button
          class="w-full bg-red-600 text-white py-2 rounded disabled:opacity-50"
          :disabled="loading"
          type="submit"
        >
          <span v-if="loading">Désinscription...</span>
          <span v-else>Se désinscrire</span>
        </button>
      </form>
      <p v-if="success" class="text-green-600 mt-4">Vous avez été désinscrit de la newsletter.</p>
      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
      <router-link to="/" class="block mt-6 text-blue-600 underline">Retour à l'accueil</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

const unsubscribe = async () => {
  loading.value = true
  success.value = false
  error.value = ''
  try {
    await axios.post('/api/alerts/newsletter/unsubscribe', { email: email.value })
    success.value = true
    email.value = ''
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Erreur lors de la désinscription. Essayez plus tard.'
  } finally {
    loading.value = false
  }
}
</script> 