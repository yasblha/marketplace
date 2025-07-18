<template>
  <div class="bg-white p-6">
    <h2 class="text-xl font-semibold mb-6">Mes alertes</h2>
    
    <!-- Gestion des alertes produits -->
    <div v-if="loading" class="flex justify-center py-4">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
    </div>
    
    <template v-else>
      <!-- Tableau des alertes -->
      <div v-if="userAlerts.length > 0">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="alert in userAlerts" :key="alert.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-blue-100 text-blue-800': alert.type === 'restock',
                      'bg-green-100 text-green-800': alert.type === 'price_change',
                      'bg-purple-100 text-purple-800': alert.type === 'new_product'
                    }">
                    {{ formatAlertType(alert.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <router-link 
                    v-if="alert.product_id" 
                    :to="`/product/${encodeProductId(alert.product_id)}`"
                    class="text-primary-600 hover:text-primary-800">
                    {{ getProductName(alert.product_id) }}
                  </router-link>
                  <span v-else>-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <button @click="toggleAlertStatus(alert)" class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200" 
                      :class="[alert.is_active ? 'bg-primary-600' : 'bg-gray-200']">
                      <span :class="[alert.is_active ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']"></span>
                    </button>
                    <span class="ml-2 text-sm">{{ alert.is_active ? 'Actif' : 'Inactif' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="deleteUserAlert(alert.id)" class="text-red-600 hover:text-red-900">
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else class="text-center py-4 text-gray-500">
        <p>Vous n'avez pas encore d'alertes configurées.</p>
        <p class="mt-2">Naviguez sur les produits pour créer des alertes de disponibilité ou de changement de prix.</p>
      </div>
    </template>
    
    <!-- Section newsletter -->
    <div class="mt-8 border-t pt-6">
      <h3 class="text-lg font-semibold mb-4">Newsletter et nouvelles collections</h3>
      
      <div class="space-y-4">
        <div class="flex items-center">
          <input 
            id="newsletter" 
            type="checkbox" 
            v-model="newsletterSubscription.general"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="newsletter" class="ml-2 block text-sm text-gray-700">
            Recevoir la newsletter générale (nouvelles collections, promotions)
          </label>
        </div>
        
        <!-- Catégories préférées pour les nouveaux produits -->
        <div v-if="newsletterSubscription.general" class="pl-6 space-y-3">
          <p class="text-sm font-medium text-gray-700">Je souhaite être informé des nouveaux produits dans ces catégories:</p>
          
          <div class="grid grid-cols-2 gap-2">
            <div v-for="category in availableCategories" :key="category.value" class="flex items-center">
              <input 
                :id="`category-${category.value}`" 
                type="checkbox" 
                v-model="newsletterSubscription.categories"
                :value="category.value"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label :for="`category-${category.value}`" class="ml-2 block text-sm text-gray-700">
                {{ category.label }}
              </label>
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <button 
            @click="updateNewsletterPreferences"
            class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            :disabled="updateLoading"
          >
            <span v-if="updateLoading">Enregistrement...</span>
            <span v-else>Enregistrer mes préférences</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Message de notification -->
    <div v-if="notification" class="mt-4 p-3 rounded" :class="notification.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAlertStore } from '@/stores/alerts'
import { useProductStore } from '@/stores/products'

// Stores
const alertStore = useAlertStore()
const productStore = useProductStore()

// État local
const loading = ref(false)
const updateLoading = ref(false)
const notification = ref<{message: string, success: boolean} | null>(null)
const newsletterSubscription = ref({
  general: false,
  categories: [] as string[]
})

// Liste des catégories disponibles
const availableCategories = [
  { value: 'clothing', label: 'Vêtements' },
  { value: 'electronics', label: 'Électronique' },
  { value: 'home', label: 'Maison' },
  { value: 'sports', label: 'Sports' },
  { value: 'beauty', label: 'Beauté' },
  { value: 'books', label: 'Livres' }
]

// Computed
const userAlerts = computed(() => alertStore.getUserAlerts)

// Méthodes
const formatAlertType = (type: string): string => {
  switch(type) {
    case 'restock': return 'Réapprovisionnement'
    case 'price_change': return 'Changement de prix'
    case 'new_product': return 'Nouveau produit'
    default: return type
  }
}

const encodeProductId = (id: string): string => {
  return btoa(id)
}

const getProductName = (productId: string): string => {
  return `Produit #${productId.substring(0, 8)}...`
}

const showNotification = (message: string, success: boolean = true) => {
  notification.value = { message, success }
  setTimeout(() => {
    notification.value = null
  }, 5000)
}

const toggleAlertStatus = async (alert: any) => {
  try {
    loading.value = true
    await alertStore.toggleAlert(alert.id, !alert.is_active)
    showNotification(`Alerte ${!alert.is_active ? 'activée' : 'désactivée'} avec succès.`)
  } catch (error: any) {
    showNotification(error.message || 'Une erreur est survenue lors de la mise à jour de l\'alerte.', false)
  } finally {
    loading.value = false
  }
}

const deleteUserAlert = async (alertId: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) return
  
  try {
    loading.value = true
    await alertStore.deleteAlert(alertId)
    showNotification('Alerte supprimée avec succès.')
  } catch (error: any) {
    showNotification(error.message || 'Une erreur est survenue lors de la suppression de l\'alerte.', false)
  } finally {
    loading.value = false
  }
}

const updateNewsletterPreferences = async () => {
  try {
    updateLoading.value = true
    
    const preferences = {
      newsletter: newsletterSubscription.value.general,
      categories: newsletterSubscription.value.general ? newsletterSubscription.value.categories : []
    }
    
    await alertStore.subscribeNewsletter(preferences)
    showNotification('Vos préférences de newsletter ont été mises à jour avec succès.')
  } catch (error: any) {
    showNotification(error.message || 'Une erreur est survenue lors de la mise à jour de vos préférences.', false)
  } finally {
    updateLoading.value = false
  }
}

// Chargement des données au montage du composant
onMounted(async () => {
  loading.value = true
  try {
    await alertStore.fetchUserAlerts()
  } catch (error) {
    console.error('Erreur lors du chargement des alertes:', error)
  } finally {
    loading.value = false
  }
})
</script>