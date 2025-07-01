<template>
  <div class="p-6 space-y-8">
    <!-- KPIs -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div class="bg-white rounded shadow p-4 text-center">
        <div class="text-2xl font-bold">{{ filteredOrdersList.length }}</div>
        <div class="text-gray-500">Commandes</div>
      </div>
      <div class="bg-white rounded shadow p-4 text-center">
        <div class="text-2xl font-bold">{{ topProducts.length }}</div>
        <div class="text-gray-500">Produits vendus</div>
      </div>
      <div class="bg-white rounded shadow p-4 text-center">
        <div class="text-2xl font-bold">{{ topClients.length }}</div>
        <div class="text-gray-500">Clients actifs</div>
      </div>
      <div class="bg-white rounded shadow p-4 text-center">
        <div class="text-2xl font-bold">{{ totalRevenue }} €</div>
        <div class="text-gray-500">Chiffre d'affaires</div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="flex flex-wrap gap-4 items-center mb-4">
      <input type="month" v-model="selectedMonth" class="border rounded px-2 py-1" />
      <select v-model="selectedCategory" class="border rounded px-2 py-1">
        <option value="">Toutes catégories</option>
        <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <button class="btn-primary" @click="exportCSV">Exporter top produits</button>
      <button class="btn-primary" @click="exportOrdersCSV">Exporter commandes</button>
      <button class="btn-primary" @click="exportProductsCSV">Exporter produits</button>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <StatsSalesChart :data="filteredSales.data"   :labels="filteredSales.labels" />
      <StatsDonutChart :data="filteredCategories.data" :labels="filteredCategories.labels" />
      <StatsBarChart   :data="filteredOrders.data" :labels="filteredOrders.labels" />
    </div>

    <!-- Top produits -->
    <div>
      <h3 class="font-semibold text-lg mb-2">Top produits vendus</h3>
      <table class="w-full text-sm border mb-4">
        <thead>
          <tr><th>Produit</th><th>Catégorie</th><th>Ventes</th></tr>
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

    <!-- Top clients -->
    <div>
      <h3 class="font-semibold text-lg mb-2">Top clients</h3>
      <table class="w-full text-sm border mb-4">
        <thead>
          <tr><th>Client</th><th>Commandes</th><th>Total dépensé</th></tr>
        </thead>
        <tbody>
          <tr v-for="client in topClients" :key="client.userId">
            <td>{{ client.userId }}</td>
            <td>{{ client.orders }}</td>
            <td>{{ client.total }} €</td>
          </tr>
          <tr v-if="!topClients.length">
            <td colspan="3" class="text-center text-gray-400">Aucun client</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Commandes -->
    <div>
      <h3 class="font-semibold text-lg mb-2">Commandes</h3>
      <table class="w-full text-sm border">
        <thead>
          <tr><th>Date</th><th>Client</th><th>Montant</th><th>Statut</th></tr>
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
import { useOrderStore }   from '@/stores/Commande'

import StatsSalesChart  from '@/components/admin/StatsSalesChart.vue'
import StatsDonutChart  from '@/components/admin/StatsDonutChart.vue'
import StatsBarChart    from '@/components/admin/StatsBarChart.vue'

/* ---------- Stores ---------- */
const productStore = useProductStore()
const orderStore   = useOrderStore()

/* ---------- Utilitaire ---------- */
const toArray = <T>(val: unknown, fallback: T[] = []): T[] =>
  Array.isArray(val) ? val : fallback

/* ---------- Filtres ---------- */
const selectedMonth    = ref('')   // format YYYY-MM
const selectedCategory = ref('')

/* ---------- Chargement initial ---------- */
onMounted(() => {
  productStore.fetchProducts()
  orderStore.fetchOrders()
})

/* ---------- Catégories dispo ---------- */
const categoryOptions = computed(() => {
  const set = new Set<string>()
  toArray(productStore.products).forEach(p => set.add(p.category ?? 'Autre'))
  return [...set]
})

/* ---------- Commandes filtrées ---------- */
const filteredOrdersList = computed(() => {
  return toArray(orderStore.orders).filter(order => {
    const d     = new Date(order.dateOrder)
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    return !selectedMonth.value || month === selectedMonth.value
  })
})

/* ---------- Agg. chiffre d'affaires par mois ---------- */
const filteredSales = computed(() => {
  const map = new Map<string, number>()
  filteredOrdersList.value.forEach(o => {
    const d = new Date(o.dateOrder)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map.set(key, (map.get(key) ?? 0) + o.totalAmount)
  })
  const labels = [...map.keys()].sort()
  return { labels, data: labels.map(l => map.get(l) ?? 0) }
})

/* ---------- Agg. nb commandes par mois ---------- */
const filteredOrders = computed(() => {
  const map = new Map<string, number>()
  filteredOrdersList.value.forEach(o => {
    const d = new Date(o.dateOrder)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map.set(key, (map.get(key) ?? 0) + 1)
  })
  const labels = [...map.keys()].sort()
  return { labels, data: labels.map(l => map.get(l) ?? 0) }
})

/* ---------- Répartition catégories produits ---------- */
const filteredCategories = computed(() => {
  const map = new Map<string, number>()
  toArray(productStore.products).forEach(p => {
    if (selectedCategory.value && p.category !== selectedCategory.value) return
    const cat = p.category ?? 'Autre'
    map.set(cat, (map.get(cat) ?? 0) + 1)
  })
  const labels = [...map.keys()]
  return { labels, data: labels.map(l => map.get(l) ?? 0) }
})

/* ---------- Top produits ---------- */
const topProducts = computed(() => {
  const salesMap = new Map<string, { id: string | number; name: string; category: string; sales: number }>()
  const orders   = toArray(orderStore.orders)
  const products = toArray(productStore.products)

  orders.forEach(order => {
    const detailsArr =
      toArray((order as any).OrderDetails).concat(toArray((order as any).details))

    detailsArr.forEach(detail => {
      const prod = products.find(
        p => String(p.id ?? p._id) === String(detail.productId)
      )
      if (!prod) return

      const key = String(prod.id ?? prod._id)
      if (!salesMap.has(key)) {
        salesMap.set(key, { id: key, name: prod.name, category: prod.category, sales: 0 })
      }
      salesMap.get(key)!.sales += detail.quantity ?? 0
    })
  })

  return [...salesMap.values()]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
})

/* ---------- Top clients ---------- */
const topClients = computed(() => {
  const map = new Map<string, { userId: string | number; orders: number; total: number }>()
  toArray(orderStore.orders).forEach(o => {
    const key = String(o.userId)
    if (!map.has(key)) map.set(key, { userId: o.userId, orders: 0, total: 0 })
    map.get(key)!.orders += 1
    map.get(key)!.total  += o.totalAmount ?? 0
  })
  return [...map.values()].sort((a, b) => b.orders - a.orders).slice(0, 5)
})

/* ---------- KPI revenu total ---------- */
const totalRevenue = computed(() =>
  filteredOrdersList.value.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0)
)

/* ---------- Export CSV ---------- */
function downloadCsv(data: string, filename: string) {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function exportCSV() {
  let csv = 'Produit,Catégorie,Ventes\\n'
  topProducts.value.forEach(p => { csv += `${p.name},${p.category},${p.sales}\\n` })
  downloadCsv(csv, 'top-produits.csv')
}

function exportOrdersCSV() {
  let csv = 'Date,Client,Montant,Statut\\n'
  filteredOrdersList.value.forEach(o => {
    csv += `${formatDate(o.dateOrder)},${o.userId},${o.totalAmount},${o.statusOrder}\\n`
  })
  downloadCsv(csv, 'commandes.csv')
}

function exportProductsCSV() {
  let csv = 'Produit,Catégorie,Stock,Statut\\n'
  toArray(productStore.products).forEach(p => {
    csv += `${p.name},${p.category},${p.stock_available},${p.status}\\n`
  })
  downloadCsv(csv, 'produits.csv')
}

/* ---------- Helpers ---------- */
function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition;
}
</style>
