<template>
  <div class="p-6 space-y-8">
    <div class="flex flex-wrap gap-4 items-center mb-4">
      <input type="month" v-model="selectedMonth" class="border rounded px-2 py-1" />
      <select v-model="selectedCategory" class="border rounded px-2 py-1">
        <option value="">Toutes catégories</option>
        <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <button class="btn-primary" @click="exportCSV">Exporter CSV</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <StatsSalesChart :data="filteredSales.data" :labels="filteredSales.labels" />
      <StatsDonutChart :data="filteredCategories.data" :labels="filteredCategories.labels" />
      <StatsBarChart :data="filteredOrders.data" :labels="filteredOrders.labels" />
    </div>
    <div>
      <h3 class="font-semibold text-lg mb-2">Top produits vendus</h3>
      <table class="w-full text-sm border mb-4">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Catégorie</th>
            <th>Ventes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prod in topProducts" :key="prod.id">
            <td>{{ prod.name }}</td>
            <td>{{ prod.category }}</td>
            <td>{{ prod.sales }}</td>
          </tr>
          <tr v-if="!topProducts.length">
            <td colspan="3" class="text-center text-gray-400">Aucune vente</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3 class="font-semibold text-lg mb-2">Commandes</h3>
      <table class="w-full text-sm border">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Montant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrdersList" :key="order.id">
            <td>{{ formatDate(order.dateOrder) }}</td>
            <td>{{ order.userId }}</td>
            <td>{{ order.totalAmount }} €</td>
            <td>{{ order.statusOrder }}</td>
          </tr>
          <tr v-if="!filteredOrdersList.length">
            <td colspan="4" class="text-center text-gray-400">Aucune commande</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { useOrderStore } from '@/stores/Commande'
import StatsSalesChart from '@/components/admin/StatsSalesChart.vue'
import StatsDonutChart from '@/components/admin/StatsDonutChart.vue'
import StatsBarChart from '@/components/admin/StatsBarChart.vue'

const productStore = useProductStore()
const orderStore = useOrderStore()

const selectedMonth = ref('')
const selectedCategory = ref('')

onMounted(() => {
  productStore.fetchProducts()
  orderStore.fetchOrders()
})

const categoryOptions = computed(() => {
  const set = new Set<string>()
  productStore.products.forEach(p => set.add(p.category || 'Autre'))
  return Array.from(set)
})

// Filtres pour les graphiques
const filteredOrdersList = computed(() => {
  return orderStore.orders.filter(order => {
    const d = new Date(order.dateOrder)
    const month = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    const matchMonth = !selectedMonth.value || month === selectedMonth.value
    return matchMonth
  })
})

const filteredSales = computed(() => {
  const map = new Map<string, number>()
  filteredOrdersList.value.forEach(order => {
    const d = new Date(order.dateOrder)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
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
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    map.set(key, (map.get(key) || 0) + 1)
  })
  const labels = Array.from(map.keys()).sort()
  return {
    labels,
    data: labels.map(l => map.get(l) || 0)
  }
})

const filteredCategories = computed(() => {
  const map = new Map<string, number>()
  productStore.products.forEach(p => {
    if (selectedCategory.value && p.category !== selectedCategory.value) return
    map.set(p.category || 'Autre', (map.get(p.category || 'Autre') || 0) + 1)
  })
  const labels = Array.from(map.keys())
  return {
    labels,
    data: labels.map(l => map.get(l) || 0)
  }
})

const topProducts = computed(() => {
  const salesMap = new Map<string, { name: string, category: string, sales: number, id: string|number }>()
  orderStore.orders.forEach(order => {
    order.OrderDetails.forEach(detail => {
      const prod = productStore.products.find(p => String(p.id) === String(detail.productId) || String(p._id) === String(detail.productId))
      if (!prod) return
      const key = String(prod.id)
      if (!salesMap.has(key)) {
        salesMap.set(key, { name: prod.name, category: prod.category, sales: 0, id: prod.id })
      }
      salesMap.get(key)!.sales += detail.quantity
    })
  })
  return Array.from(salesMap.values()).sort((a, b) => b.sales - a.sales).slice(0, 5)
})

function exportCSV() {
  let csv = 'Produit,Catégorie,Ventes\n'
  topProducts.value.forEach(p => {
    csv += `${p.name},${p.category},${p.sales}\n`
  })
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'top-produits.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function formatDate(d: string|Date) {
  return new Date(d).toLocaleString('fr-FR')
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition;
}
</style> 