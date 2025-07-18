<template>
  <div class="mt-4 border-t pt-4">
    <h3 class="text-lg font-semibold mb-2">Alertes</h3>
    
    <div v-if="!isAuthenticated" class="text-sm text-gray-600 mb-2">
      <p>Connectez-vous pour recevoir des alertes sur ce produit</p>
      <router-link to="/login" class="text-primary-600 hover:text-primary-700">
        Se connecter
      </router-link>
    </div>
    
    <div v-else class="space-y-2">
      <!-- Alerte de réapprovisionnement (quand stock épuisé) -->
      <div v-if="product.status !== 'available'" class="flex items-center">
        <button 
          @click="subscribeToRestock" 
          :disabled="loading || hasActiveAlert('restock')"
          class="flex items-center gap-2 text-sm px-4 py-2 rounded border transition hover:bg-gray-50"
          :class="hasActiveAlert('restock') ? 'bg-green-50 text-green-700 border-green-300' : 'border-gray-300'"
        >
          <span v-if="hasActiveAlert('restock')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </span>
          <span v-if="loading && currentAction === 'restock'" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
          <span>{{ hasActiveAlert('restock') ? 'Alerte activée' : 'M\'avertir quand disponible' }}</span>
        </button>
      </div>
      
      <!-- Alerte de changement de prix -->
      <div class="flex items-center">
        <button 
          @click="subscribeToPriceChange" 
          :disabled="loading || hasActiveAlert('price_change')"
          class="flex items-center gap-2 text-sm px-4 py-2 rounded border transition hover:bg-gray-50"
          :class="hasActiveAlert('price_change') ? 'bg-green-50 text-green-700 border-green-300' : 'border-gray-300'"
        >
          <span v-if="hasActiveAlert('price_change')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
          </span>
          <span v-if="loading && currentAction === 'price_change'" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
          <span>{{ hasActiveAlert('price_change') ? 'Alerte prix activée' : 'M\'avertir des changements de prix' }}</span>
        </button>
      </div>
      
      <!-- Option pour désactiver les alertes existantes -->
      <div v-if="hasAnyAlert" class="mt-2">
        <button 
          @click="toggleAlerts" 
          class="text-sm text-gray-500 hover:text-primary-600"
        >
          {{ showManageAlerts ? 'Masquer les options' : 'Gérer mes alertes' }}
        </button>
        
        <div v-if="showManageAlerts" class="mt-2 space-y-2 pl-2 border-l-2 border-gray-200">
          <div v-for="alert in productAlerts" :key="alert.id" class="flex justify-between items-center text-sm">
            <span>{{ formatAlertType(alert.type) }}</span>
            <div class="flex gap-2">
              <button 
                @click="toggleAlertStatus(alert)" 
                class="text-xs px-2 py-1 rounded"
                :class="alert.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
              >
                {{ alert.is_active ? 'Activée' : 'Désactivée' }}
              </button>
              <button 
                @click="deleteAlert(alert.id)"
                class="text-xs px-2 py-1 rounded bg-red-100 text-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message de notification -->
    <div v-if="notificationMessage" class="mt-2 text-sm p-2 rounded" :class="notificationSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAlertStore } from '@/stores/alerts'
import { useAuthStore } from '@/stores/user'
import type { Product } from '@/types/product'

const props = defineProps<{
  product: Product
}>()

const alertStore = useAlertStore()
const authStore = useAuthStore()

// État local
const loading = ref(false)
const notificationMessage = ref('')
const notificationSuccess = ref(true)
const showManageAlerts = ref(false)
const currentAction = ref<string | null>(null)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userAlerts = computed(() => alertStore.getUserAlerts)

const productAlerts = computed(() => {
  return userAlerts.value.filter(alert => alert.product_id === props.product._id)
})

const hasAnyAlert = computed(() => {
  return productAlerts.value.length > 0
})

// Vérifier si l'utilisateur a déjà une alerte active pour ce produit et de ce type
const hasActiveAlert = (type: string) => {
  // Récupérer l'ID du produit disponible (_id ou id)
  const productId = props.product._id || props.product.id;
  
  return userAlerts.value.some(
    alert => alert.product_id === productId && 
             alert.type === type && 
             alert.is_active
  )
}

// Méthodes
const formatAlertType = (type: string): string => {
  switch(type) {
    case 'restock': return 'Réapprovisionnement'
    case 'price_change': return 'Changement de prix'
    default: return type
  }
}

const showNotification = (message: string, success: boolean = true) => {
  notificationMessage.value = message
  notificationSuccess.value = success
  
  // Effacer après 5 secondes
  setTimeout(() => {
    notificationMessage.value = ''
  }, 5000)
}

const subscribeToRestock = async () => {
  if (!isAuthenticated.value) return
  
  try {
    // Utiliser l'ID du produit disponible (_id ou id)
    const productId = props.product._id || props.product.id;
    console.log('Restock Alert - ID du produit utilisé:', productId);
    
    loading.value = true
    currentAction.value = 'restock'
    await alertStore.createRestockAlert(productId)
    showNotification('Vous serez alerté dès que ce produit sera à nouveau en stock.')
  } catch (error: any) {
    showNotification(error.response?.data?.message || 'Une erreur est survenue', false)
  } finally {
    loading.value = false
    currentAction.value = null
  }
}

const subscribeToPriceChange = async () => {
  if (!isAuthenticated.value) return
  
  try {
    // Débogage de l'ID du produit
    console.log('Produit:', props.product);
    console.log('ID du produit (_id):', props.product._id);
    console.log('ID du produit (id):', props.product.id);
    
    // Utiliser l'ID du produit disponible (_id ou id)
    const productId = props.product._id || props.product.id;
    console.log('ID du produit utilisé:', productId);
    console.log('Type de l\'ID du produit:', typeof productId);
    
    // Débogage du token d'authentification
    const authData = localStorage.getItem('auth')
    console.log('Auth data in localStorage:', authData)
    
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        console.log('Token présent dans auth:', !!parsed.token)
        console.log('User ID dans auth:', parsed.user?.id || 'Non disponible')
      } catch (e) {
        console.error('Erreur de parsing auth data:', e)
      }
    } else {
      console.log('Aucune donnée auth dans localStorage')
    }
    
    loading.value = true
    currentAction.value = 'price_change'
    await alertStore.createPriceChangeAlert(productId)
    showNotification('Vous serez alerté si le prix de ce produit change.')
  } catch (error: any) {
    console.error('Erreur complète:', error)
    showNotification(error.response?.data?.message || 'Une erreur est survenue', false)
  } finally {
    loading.value = false
    currentAction.value = null
  }
}

const toggleAlerts = () => {
  showManageAlerts.value = !showManageAlerts.value
}

const toggleAlertStatus = async (alert: any) => {
  try {
    loading.value = true
    await alertStore.toggleAlert(alert.id, !alert.is_active)
    showNotification(`Alerte ${!alert.is_active ? 'activée' : 'désactivée'} avec succès.`)
  } catch (error: any) {
    showNotification(error.response?.data?.message || 'Une erreur est survenue', false)
  } finally {
    loading.value = false
  }
}

const deleteAlert = async (alertId: number) => {
  try {
    loading.value = true
    await alertStore.deleteAlert(alertId)
    showNotification('Alerte supprimée avec succès.')
  } catch (error: any) {
    showNotification(error.response?.data?.message || 'Une erreur est survenue', false)
  } finally {
    loading.value = false
  }
}

// Charger les alertes de l'utilisateur au montage du composant
onMounted(() => {
  if (isAuthenticated.value) {
    alertStore.fetchUserAlerts()
  }
})

// Recharger les alertes si l'état d'authentification change
watch(() => isAuthenticated.value, (newValue) => {
  if (newValue) {
    alertStore.fetchUserAlerts()
  }
})
</script>
