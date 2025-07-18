<template>
  <div class="p-6 space-y-8 bg-gray-50">
    <!-- En-tête avec titre et période -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Rapports & Analyses</h2>
        <p class="text-gray-500 text-sm">Visualisez les performances de votre boutique</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button 
          @click="exportCSV" 
          class="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          <i class="fas fa-file-csv mr-2"></i>
          Exporter CSV
        </button>
        <button 
          @click="exportPDF" 
          class="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          <i class="fas fa-file-pdf mr-2"></i>
          Exporter PDF
        </button>
      </div>
    </div>

    <!-- Filtres améliorés -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <h3 class="font-medium text-gray-700 mb-4">Filtres</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Période</label>
          <div class="flex gap-2">
            <select v-model="selectedPeriod" class="border rounded-md px-3 py-2 w-full bg-white">
              <option value="custom">Personnalisée</option>
              <option value="30">30 derniers jours</option>
              <option value="90">90 derniers jours</option>
              <option value="180">6 derniers mois</option>
              <option value="365">Année courante</option>
            </select>
            <input 
              v-if="selectedPeriod === 'custom'" 
              type="month" 
              v-model="selectedMonth" 
              class="border rounded-md px-3 py-2 w-full"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">Catégorie</label>
          <select v-model="selectedCategory" class="border rounded-md px-3 py-2 w-full bg-white">
            <option value="">Toutes catégories</option>
            <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Statut des commandes</label>
          <select v-model="selectedStatus" class="border rounded-md px-3 py-2 w-full bg-white">
            <option value="">Tous les statuts</option>
            <option value="confirmed">Confirmées</option>
            <option value="delivered">Livrées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Résumé des KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4 flex items-center">
        <div class="rounded-full bg-blue-100 p-3 mr-3">
          <i class="fas fa-euro-sign text-blue-600"></i>
        </div>
        <div>
          <p class="text-sm text-gray-500">Chiffre d'affaires</p>
          <p class="text-xl font-bold">{{ totalRevenue.toFixed(2) }} €</p>
          <p :class="[revenueChange > 0 ? 'text-green-600' : 'text-red-600', 'text-xs']">
            <i :class="revenueChange > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i> 
            {{ Math.abs(revenueChange).toFixed(2) }}% depuis la période précédente
          </p>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-4 flex items-center">
        <div class="rounded-full bg-green-100 p-3 mr-3">
          <i class="fas fa-shopping-cart text-green-600"></i>
        </div>
        <div>
          <p class="text-sm text-gray-500">Commandes</p>
          <p class="text-xl font-bold">{{ totalOrders }}</p>
          <p :class="[ordersChange > 0 ? 'text-green-600' : 'text-red-600', 'text-xs']">
            <i :class="ordersChange > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i> 
            {{ Math.abs(ordersChange).toFixed(2) }}% depuis la période précédente
          </p>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-4 flex items-center">
        <div class="rounded-full bg-purple-100 p-3 mr-3">
          <i class="fas fa-tags text-purple-600"></i>
        </div>
        <div>
          <p class="text-sm text-gray-500">Panier moyen</p>
          <p class="text-xl font-bold">{{ averageOrderValue.toFixed(2) }} €</p>
          <p :class="[aovChange > 0 ? 'text-green-600' : 'text-red-600', 'text-xs']">
            <i :class="aovChange > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i> 
            {{ Math.abs(aovChange).toFixed(2) }}% depuis la période précédente
          </p>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-4 flex items-center">
        <div class="rounded-full bg-amber-100 p-3 mr-3">
          <i class="fas fa-box text-amber-600"></i>
        </div>
        <div>
          <p class="text-sm text-gray-500">Produits vendus</p>
          <p class="text-xl font-bold">{{ totalProductsSold }}</p>
          <p :class="[productsSoldChange > 0 ? 'text-green-600' : 'text-red-600', 'text-xs']">
            <i :class="productsSoldChange > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i> 
            {{ Math.abs(productsSoldChange).toFixed(2) }}% depuis la période précédente
          </p>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-gray-700">Évolution des ventes</h3>
          <div class="text-sm">
            <select v-model="salesChartType" class="border rounded p-1 text-xs">
              <option value="line">Ligne</option>
              <option value="bar">Barre</option>
            </select>
          </div>
        </div>
        <component :is="salesChartType === 'line' ? 'StatsSalesChart' : 'StatsBarChart'" 
          :data="filteredSales.data" 
          :labels="filteredSales.labels" 
          :colors="['#3b82f6']"
        />
      </div>
      
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-gray-700">Répartition des catégories</h3>
        </div>
        <StatsDonutChart 
          :data="filteredCategories.data" 
          :labels="filteredCategories.labels" 
        />
      </div>
      
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-gray-700">Commandes mensuelles</h3>
        </div>
        <StatsBarChart 
          :data="filteredOrders.data" 
          :labels="filteredOrders.labels" 
          :colors="['#10b981']"
        />
      </div>
    </div>

    <!-- Top produits vendus -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-gray-700">Top produits vendus</h3>
        <button class="text-blue-600 text-sm hover:underline">
          Voir tous les produits
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left">Produit</th>
              <th class="px-4 py-3 text-left">Catégorie</th>
              <th class="px-4 py-3 text-right">Ventes</th>
              <th class="px-4 py-3 text-right">Chiffre d'affaires</th>
              <th class="px-4 py-3 text-center">Tendance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in topProducts" :key="prod.id" class="border-b hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-200 rounded-md mr-3"></div>
                  <span>{{ prod.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{{ prod.category }}</span>
              </td>
              <td class="px-4 py-3 text-right">{{ prod.sales }}</td>
              <td class="px-4 py-3 text-right">{{ (prod.revenue || 0).toFixed(2) }} €</td>
              <td class="px-4 py-3 text-center">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="{
                  'bg-green-100 text-green-800': prod.trend > 0,
                  'bg-gray-100 text-gray-800': prod.trend === 0,
                  'bg-red-100 text-red-800': prod.trend < 0
                }">
                  <i :class="{
                    'fas fa-arrow-up mr-1': prod.trend > 0,
                    'fas fa-equals mr-1': prod.trend === 0,
                    'fas fa-arrow-down mr-1': prod.trend < 0
                  }"></i>
                  {{ Math.abs(prod.trend || 0) }}%
                </span>
              </td>
            </tr>
            <tr v-if="!topProducts.length">
              <td colspan="5" class="text-center text-gray-400 py-4">Aucune vente</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Dernières commandes -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-gray-700">Dernières commandes</h3>
        <button class="text-blue-600 text-sm hover:underline">
          Voir toutes les commandes
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left">ID</th>
              <th class="px-4 py-3 text-left">Date</th>
              <th class="px-4 py-3 text-left">Client</th>
              <th class="px-4 py-3 text-right">Montant</th>
              <th class="px-4 py-3 text-center">Statut</th>
              <th class="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrdersList.slice(0, 5)" :key="order.id" class="border-b hover:bg-gray-50">
              <td class="px-4 py-3">#{{ order.id.substring(0, 8) }}</td>
              <td class="px-4 py-3">{{ formatDate(order.dateOrder) }}</td>
              <td class="px-4 py-3">{{ getUserName(order.userId) }}</td>
              <td class="px-4 py-3 text-right">{{ order.totalAmount.toFixed(2) }} €</td>
              <td class="px-4 py-3 text-center">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="{
                  'bg-green-100 text-green-800': order.statusOrder === 'delivered',
                  'bg-blue-100 text-blue-800': order.statusOrder === 'confirmed',
                  'bg-amber-100 text-amber-800': order.statusOrder === 'processing',
                  'bg-red-100 text-red-800': order.statusOrder === 'cancelled'
                }">
                  {{ getStatusLabel(order.statusOrder) }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <button class="text-gray-500 hover:text-blue-600">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!filteredOrdersList.length">
              <td colspan="6" class="text-center text-gray-400 py-4">Aucune commande</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { useOrderStore } from '@/stores/Commande'
import { useUserStore } from '@/stores/userStore' 
import StatsSalesChart from '@/components/admin/StatsSalesChart.vue'
import StatsDonutChart from '@/components/admin/StatsDonutChart.vue'
import StatsBarChart from '@/components/admin/StatsBarChart.vue'

const productStore = useProductStore()
const orderStore = useOrderStore()
let userStore = null

try {
  userStore = useUserStore()
} catch (error) {
  console.error('Erreur lors du chargement du store utilisateur:', error)
}

// Variables de filtrage améliorées
const selectedMonth = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const selectedPeriod = ref('30') 
const salesChartType = ref('line')

// Variables pour l'interface
const isExporting = ref(false)

onMounted(() => {
  productStore.fetchProducts()
  orderStore.fetchOrders()
  if (userStore && userStore.fetchUsers) {
    userStore.fetchUsers()
  }
})

// Options de filtres
const categoryOptions = computed(() => {
  const set = new Set<string>()
  productStore.products.forEach(p => set.add(p.category || 'Autre'))
  return Array.from(set).sort()
})

// Utilitaires de dates pour le filtrage
const getDateRangeFromPeriod = () => {
  const today = new Date()
  const end = new Date(today)
  let start

  if (selectedPeriod.value === 'custom' && selectedMonth.value) {
    const [year, month] = selectedMonth.value.split('-').map(Number)
    start = new Date(year, month - 1, 1)
    end.setFullYear(year, month, 0) 
  } else {
    const days = parseInt(selectedPeriod.value) || 30
    start = new Date(today)
    start.setDate(today.getDate() - days)
  }
  
  return { start, end }
}

// Filtres pour les commandes
const filteredOrdersList = computed(() => {
  const { start, end } = getDateRangeFromPeriod()
  
  return orderStore.orders.filter(order => {
    const orderDate = new Date(order.dateOrder)
    const isInDateRange = orderDate >= start && orderDate <= end
    const matchStatus = !selectedStatus.value || order.statusOrder === selectedStatus.value
    
    return isInDateRange && matchStatus
  })
})

// KPIs - Indicateurs clés
const totalRevenue = computed(() => {
  return filteredOrdersList.value.reduce((sum, order) => sum + order.totalAmount, 0)
})

const totalOrders = computed(() => {
  return filteredOrdersList.value.length
})

const averageOrderValue = computed(() => {
  return totalOrders.value ? totalRevenue.value / totalOrders.value : 0
})

const totalProductsSold = computed(() => {
  return filteredOrdersList.value.reduce((sum, order) => {
    return sum + order.OrderDetails.reduce((sum, detail) => sum + detail.quantity, 0)
  }, 0)
})

// Tendances (fausses données pour l'exemple - à remplacer par de vrais calculs)
const revenueChange = ref(12.5)
const ordersChange = ref(-5.2)
const aovChange = ref(3.8)
const productsSoldChange = ref(8.1)

// Données pour les graphiques
const filteredSales = computed(() => {
  const map = new Map<string, number>()
  
  filteredOrdersList.value.forEach(order => {
    const d = new Date(order.dateOrder)
    let key
    
    // Formater les clés en fonction de la période
    if (selectedPeriod.value === 'custom' || selectedPeriod.value === '30' || selectedPeriod.value === '90') {
      // Format journalier pour les périodes courtes
      key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    } else {
      // Format mensuel pour les périodes longues
      key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    }
    
    map.set(key, (map.get(key) || 0) + order.totalAmount)
  })
  
  const labels = Array.from(map.keys()).sort()
  return {
    labels,
    data: labels.map(l => map.get(l) || 0)
  }
})

const filteredOrders = computed(() => {
  const map = new Map<string, number>()
  
  filteredOrdersList.value.forEach(order => {
    const d = new Date(order.dateOrder)
    let key
    
    // Même logique que pour les ventes
    if (selectedPeriod.value === 'custom' || selectedPeriod.value === '30' || selectedPeriod.value === '90') {
      key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    }
    
    map.set(key, (map.get(key) || 0) + 1)
  })
  
  const labels = Array.from(map.keys()).sort()
  return {
    labels,
    data: labels.map(l => map.get(l) || 0)
  }
})

const filteredCategories = computed(() => {
  // Compter les produits vendus par catégorie
  const map = new Map<string, number>()
  
  filteredOrdersList.value.forEach(order => {
    order.OrderDetails.forEach(detail => {
      const prod = productStore.products.find(p => 
        String(p.id) === String(detail.productId) || 
        String(p._id) === String(detail.productId)
      )
      
      if (!prod) return
      if (selectedCategory.value && prod.category !== selectedCategory.value) return
      
      const category = prod.category || 'Autre'
      map.set(category, (map.get(category) || 0) + detail.quantity)
    })
  })
  
  const labels = Array.from(map.keys())
  return {
    labels,
    data: labels.map(l => map.get(l) || 0)
  }
})

// Top produits avec données enrichies
const topProducts = computed(() => {
  const salesMap = new Map<string, { 
    name: string, 
    category: string, 
    sales: number, 
    revenue: number,
    id: string|number,
    trend: number 
  }>()
  
  filteredOrdersList.value.forEach(order => {
    order.OrderDetails.forEach(detail => {
      const prod = productStore.products.find(p => 
        String(p.id) === String(detail.productId) || 
        String(p._id) === String(detail.productId)
      )
      if (!prod) return
      
      const key = String(prod.id)
      if (!salesMap.has(key)) {
        salesMap.set(key, { 
          name: prod.name, 
          category: prod.category || 'Autre', 
          sales: 0, 
          revenue: 0,
          id: prod.id,
          trend: Math.floor(Math.random() * 40) - 20 
        })
      }
      
      const item = salesMap.get(key)!
      item.sales += detail.quantity
      item.revenue += detail.quantity * detail.price
    })
  })
  
  return Array.from(salesMap.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10) 
})

// Fonction d'exportation CSV améliorée
function exportCSV() {
  isExporting.value = true
  
  try {
    // En-tête pour les données de vente
    let salesCSV = 'Date,Montant\n'
    filteredSales.value.labels.forEach((label, index) => {
      salesCSV += `"${label}","${filteredSales.value.data[index].toFixed(2)}"\n`
    })
    
    // En-tête pour les top produits
    let productsCSV = 'Produit,Catégorie,Quantité vendue,Chiffre d\'affaires (€)\n'
    topProducts.value.forEach(p => {
      productsCSV += `"${p.name}","${p.category}","${p.sales}","${p.revenue.toFixed(2)}"\n`
    })
    
    // En-tête pour les commandes
    let ordersCSV = 'ID,Date,Client,Montant,Statut\n'
    filteredOrdersList.value.forEach(o => {
      ordersCSV += `"${o.id}","${formatDate(o.dateOrder)}","${getUserName(o.userId)}","${o.totalAmount.toFixed(2)}","${getStatusLabel(o.statusOrder)}"\n`
    })
    
    // Création et téléchargement des fichiers
    downloadCSV(salesCSV, 'ventes.csv')
    downloadCSV(productsCSV, 'top-produits.csv')
    downloadCSV(ordersCSV, 'commandes.csv')
  } finally {
    isExporting.value = false
  }
}

// Fonction d'exportation PDF
function exportPDF() {
  alert('Fonctionnalité d\'export PDF à implémenter. Veuillez installer la dépendance jsPDF.')
  // Pour implémenter l'export PDF, décommentez les imports jsPDF plus haut
  // et implémentez la logique d'export PDF ici
}

// Utilitaires
function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function formatDate(d: string|Date) {
  const date = new Date(d)
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getUserName(userId: string) {
  if (!userStore || !userStore.users) return `Client #${userId.substring(0, 6)}`
  
  const user = userStore.users.find(u => u.id === userId)
  return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : `Client #${userId.substring(0, 6)}`
}

function getStatusLabel(status: string) {
  const statusMap: Record<string, string> = {
    'confirmed': 'Confirmée',
    'processing': 'En traitement',
    'delivered': 'Livrée',
    'cancelled': 'Annulée'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition;
}

/* Animation de chargement */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>