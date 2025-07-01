<template>
  <div>
    <h3 class="text-lg font-semibold mb-2">Historique des mouvements de stock</h3>
    <table class="w-full text-sm border mb-4">
      <thead>
        <tr>
          <th>Date</th>
          <th>Quantité</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in history" :key="entry.id">
          <td>{{ formatDate(entry.createdAt) }}</td>
          <td :class="entry.quantity > 0 ? 'text-green-600' : 'text-red-600'">{{ entry.quantity }}</td>
          <td>{{ entry.quantity > 0 ? 'Entrée' : 'Sortie' }}</td>
        </tr>
        <tr v-if="!history.length">
          <td colspan="3" class="text-center text-gray-400">Aucun mouvement enregistré</td>
        </tr>
      </tbody>
    </table>
    <form @submit.prevent="addEntry">
      <div class="flex gap-2 items-end">
        <div>
          <label class="block text-xs mb-1">Quantité</label>
          <input v-model.number="quantity" type="number" class="border rounded px-2 py-1 w-24" required />
        </div>
        <div>
          <label class="block text-xs mb-1">Type</label>
          <select v-model="type" class="border rounded px-2 py-1">
            <option value="in">Entrée</option>
            <option value="out">Sortie</option>
          </select>
        </div>
        <button class="btn-primary" type="submit">Ajouter</button>
      </div>
    </form>
    <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import axiosInstance from '@/services/api'

const props = defineProps<{ productId: number | string }>()
const history = ref<any[]>([])
const quantity = ref(1)
const type = ref<'in' | 'out'>('in')
const error = ref('')

const fetchHistory = async () => {
  try {
    const { data } = await axiosInstance.get(`/stock/${props.productId}/history`)
    history.value = data
  } catch (e) {
    error.value = 'Erreur lors du chargement de l\'historique'
  }
}

const addEntry = async () => {
  error.value = ''
  if (!quantity.value || isNaN(quantity.value)) {
    error.value = 'Quantité invalide'
    return
  }
  const q = type.value === 'in' ? Math.abs(quantity.value) : -Math.abs(quantity.value)
  try {
    await axiosInstance.post(`/stock/${props.productId}/history`, { quantity: q })
    quantity.value = 1
    type.value = 'in'
    await fetchHistory()
  } catch (e) {
    error.value = 'Erreur lors de l\'ajout du mouvement'
  }
}

const formatDate = (d: string) => new Date(d).toLocaleString('fr-FR')

onMounted(fetchHistory)
watch(() => props.productId, fetchHistory)
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition;
}
</style> 