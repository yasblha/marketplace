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
            <tr v-for="order in filteredOrdersList.slice(0, 5)" :key="order.id || order._id" class="border-b hover:bg-gray-50">
              <td class="px-4 py-3">{{ getOrderIdDisplay(order.id || order._id) }}</td>
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { useOrderStore } from '@/stores/Commande'
import { useAuthStore } from '@/stores/user'
import StatsSalesChart from '@/components/admin/StatsSalesChart.vue'
import StatsDonutChart from '@/components/admin/StatsDonutChart.vue'
import StatsBarChart from '@/components/admin/StatsBarChart.vue'

// Import direct des stores
const productStore = useProductStore()
const orderStore = useOrderStore()
let userStore = null

try {
  // Utilisation directe du store importé
  userStore = useAuthStore()
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
  const set = new Set()
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
    return sum + (order.OrderDetails ? order.OrderDetails.reduce((s, detail) => s + detail.quantity, 0) : 0)
  }, 0)
})

// Tendances (fausses données pour l'exemple - à remplacer par de vrais calculs)
const revenueChange = ref(12.5)
const ordersChange = ref(-5.2)
const aovChange = ref(3.8)
const productsSoldChange = ref(8.1)

// Données pour les graphiques
const filteredSales = computed(() => {
  const map = new Map()
  
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
    data: labels.map(key => map.get(key))
  }
})

const filteredCategories = computed(() => {
  // Calculer les ventes par catégorie
  const map = new Map()
  
  filteredOrdersList.value.forEach(order => {
    (order.OrderDetails || []).forEach(detail => {
      const product = productStore.products.find(p => p.id === detail.productId)
      if (product) {
        const category = product.category || 'Autre'
        if (selectedCategory.value && selectedCategory.value !== category) return
        
        map.set(category, (map.get(category) || 0) + detail.price * detail.quantity)
      }
    })
  })
  
  const labels = Array.from(map.keys())
  return {
    labels,
    data: labels.map(key => map.get(key))
  }
})

const filteredOrders = computed(() => {
  const map = new Map()
  
  filteredOrdersList.value.forEach(order => {
    const d = new Date(order.dateOrder)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    
    map.set(key, (map.get(key) || 0) + 1)
  })
  
  const labels = Array.from(map.keys()).sort()
  return {
    labels,
    data: labels.map(key => map.get(key))
  }
})

// Top produits
const topProducts = computed(() => {
  // Calculer les ventes par produit
  const productSales = new Map()
  
  filteredOrdersList.value.forEach(order => {
    (order.OrderDetails || []).forEach(detail => {
      const productId = detail.productId
      const quantity = detail.quantity
      const revenue = detail.price * quantity
      
      const existing = productSales.get(productId) || { quantity: 0, revenue: 0 }
      productSales.set(productId, { 
        quantity: existing.quantity + quantity,
        revenue: existing.revenue + revenue
      })
    })
  })
  
  // Construire les données enrichies des produits
  return productStore.products
    .filter(product => {
      // Filtrer par catégorie si sélectionnée
      if (selectedCategory.value && product.category !== selectedCategory.value) return false
      // Ne garder que les produits avec des ventes
      return productSales.has(product.id)
    })
    .map(product => {
      const sales = productSales.get(product.id) || { quantity: 0, revenue: 0 }
      return {
        ...product,
        sales: sales.quantity,
        revenue: sales.revenue,
        trend: Math.floor(Math.random() * 61) - 30  // Tendance aléatoire entre -30% et +30%
      }
    })
    .sort((a, b) => b.revenue - a.revenue)  // Trier par chiffre d'affaires décroissant
    .slice(0, 10)  // Top 10
})

// Top clients
const topClients = computed(() => {
  // Calculer les commandes par client
  const clientOrders = new Map()
  
  filteredOrdersList.value.forEach(order => {
    const userId = order.userId
    const existing = clientOrders.get(userId) || { count: 0, total: 0 }
    
    clientOrders.set(userId, { 
      count: existing.count + 1,
      total: existing.total + order.totalAmount
    })
  })
  
  return Array.from(clientOrders.entries())
    .map(([userId, data]) => ({ 
      userId, 
      orders: data.count,
      total: data.total
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)  // Top 5
})

// Fonction d'exportation CSV améliorée
const exportCSV = () => {
  isExporting.value = true
  
  try {
    // Données pour l'export des ventes
    const salesData = [
      ['Date', 'Chiffre d\'affaires'],
      ...filteredSales.value.labels.map((date, index) => [
        date, 
        filteredSales.value.data[index].toFixed(2)
      ])
    ]
    
    // Données pour l'export des top produits
    const productsData = [
      ['Produit', 'Catégorie', 'Ventes', 'Chiffre d\'affaires'],
      ...topProducts.value.map(product => [
        product.name,
        product.category || 'Autre',
        product.sales,
        product.revenue.toFixed(2)
      ])
    ]
    
    // Données pour l'export des commandes
    const ordersData = [
      ['ID', 'Date', 'Client', 'Montant', 'Statut'],
      ...filteredOrdersList.value.map(order => [
        order.id,
        formatDate(order.dateOrder),
        getUserName(order.userId),
        order.totalAmount.toFixed(2),
        getStatusLabel(order.statusOrder)
      ])
    ]
    
    // Exporter chaque fichier
    downloadCSV(salesData.map(row => row.join(',')).join('\n'), 'ventes.csv')
    downloadCSV(productsData.map(row => row.join(',')).join('\n'), 'top_produits.csv')
    downloadCSV(ordersData.map(row => row.join(',')).join('\n'), 'commandes.csv')
    
    alert('Export CSV réalisé avec succès!')
  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error)
    alert('Une erreur est survenue lors de l\'export CSV')
  } finally {
    isExporting.value = false
  }
}

// Fonction d'exportation PDF
const exportPDF = () => {
  alert('Pour générer des PDF, veuillez installer jsPDF: npm install jspdf jspdf-autotable')
  console.log('TODO: Implémenter l\'export PDF avec jsPDF')
}

// Utilitaires
const downloadCSV = (content, filename) => {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(content))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const formatDate = (d) => {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

// Fonction utilitaire pour formater un ID utilisateur de façon sécurisée
const formatUserId = (userId) => {
  if (!userId) return ''
  
  if (typeof userId === 'string') {
    return userId.substring(0, 6)
  } else if (typeof userId === 'number') {
    return userId.toString().substring(0, 6)
  } else {
    return String(userId).substring(0, 6)
  }
}

const getUserName = (userId) => {
  if (!userStore || !userStore.users) return `Client #${formatUserId(userId)}`
  
  const user = userStore.users.find(u => u.id === userId)
  return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : `Client #${formatUserId(userId)}`
}

const getStatusLabel = (status) => {
  const statusMap = {
    'pending': 'En attente',
    'confirmed': 'Confirmée',
    'processing': 'En traitement',
    'shipped': 'Expédiée',
    'delivered': 'Livrée',
    'cancelled': 'Annulée'
  }
  
  return statusMap[status] || status
}

// Fonction qui extrait les 8 premiers caractères d'un ID de façon sécurisée
const getOrderIdDisplay = (id) => {
  if (!id) return '#???'
  
  if (typeof id === 'string') {
    return '#' + id.substring(0, 8)
  } else if (typeof id === 'number') {
    return '#' + id.toString().substring(0, 8)
  } else if (id._id && typeof id._id === 'string') {
    return '#' + id._id.substring(0, 8)
  } else if (id.id && typeof id.id === 'string') {
    return '#' + id.id.substring(0, 8)
  } else {
    return '#' + JSON.stringify(id).substring(0, 8)
  }
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition;
}

/* Fix pour les styles de tableaux */
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f5f9;
}
</style>
