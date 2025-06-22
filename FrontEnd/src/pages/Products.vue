<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- ░░░ Header (collé) ░░░ -->
    <header class="sticky top-0 z-30 bg-white shadow-sm">
      <BreadcrumbWithSearch @search="q => (filters.search = q)" />
      <CategoryCarousel
          :categories="categories"
          @select-category="c => (filters.category = filters.category === c ? '' : c)"
          class="border-b border-gray-200" />
    </header>

    <main class="flex-1 flex">
      <!-- ░░░ Filtres (aside) ░░░ -->
      <aside
          class="sticky top-32 hidden h-[calc(100vh-8rem)] w-72 overflow-y-auto border-r border-gray-200 bg-white p-6 lg:block">
        <ProductFilters
            :products="products"
            :initial-filters="filters"
            @update:filters="v => Object.assign(filters, v)" />
      </aside>

      <!-- ░░░ Contenu ░░░ -->
      <section class="flex-1 p-6">
        <!-- Barre titre + tri / vue -->
        <header class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Nos produits</h1>
            <p class="mt-1 text-sm text-gray-500">
              {{ displayed.length }} résultat{{ displayed.length > 1 ? 's' : '' }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <!-- tri -->
            <select v-model="sort" @change="sortProducts"
                    class="rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="popularity">Popularité</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="name_asc">Nom (A-Z)</option>
              <option value="name_desc">Nom (Z-A)</option>
              <option value="newest">Nouveautés</option>
            </select>

            <!-- vue -->
            <div class="flex rounded-lg bg-gray-100 p-1">
              <button
                  :class="btnCls(!listView)"
                  @click="listView = false"
                  title="Vue grille">
                <i class="fas fa-th"></i>
              </button>
              <button
                  :class="btnCls(listView)"
                  @click="listView = true"
                  title="Vue liste">
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
        </header>

        <!-- loader / erreurs -->
        <div v-if="loading" class="flex flex-col items-center py-24">
          <span class="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p class="mt-4 text-gray-600">Chargement…</p>
        </div>

        <p v-else-if="error" class="rounded-lg bg-red-50 p-6 text-red-700 shadow">{{ error }}</p>

        <!-- aucun résultat -->
        <div v-else-if="!displayed.length" class="rounded-lg bg-white py-16 text-center shadow">
          <i class="fas fa-search text-5xl text-gray-400" />
          <h3 class="mt-4 text-lg font-medium">Aucun produit</h3>
          <p class="mt-2 text-gray-600">Changez vos critères de recherche ou de filtre.</p>
          <button @click="reset" class="btn-primary mt-6">Réinitialiser</button>
        </div>

        <!-- liste produits -->
        <div v-else :class="gridCls">
          <ProductCard
              v-for="p in displayed"
              :key="p.id"
              :product="p"
              :show-stock-info
              :show-shipping-info
              class="h-full transition-shadow hover:shadow-lg" />
        </div>
      </section>
    </main>

    <Footer class="mt-auto" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BreadcrumbWithSearch from '@/components/UI/BreadcrumbWithSearch.vue'
import CategoryCarousel     from '@/components/UI/CategoryCarousel.vue'
import ProductCard          from '@/components/common/ProductCard.vue'
import ProductFilters       from '@/components/common/ProductFilters.vue'
import { useProductStore }  from '@/stores/products'
import type { Product }     from '@/types/product'

/* ───── stores / router ───── */
const store  = useProductStore()
const route  = useRoute()
const router = useRouter()

/* ───── état ───── */
const loading   = ref(true)
const error     = ref('')
const listView  = ref(false)
const sort      = ref<'popularity'|'price_asc'|'price_desc'|'name_asc'|'name_desc'|'newest'>('popularity')
const filters   = ref({
  category : '', brand : '', search : '', priceMin:0, priceMax:Infinity, inStock:false
})

/* ───── data dérivées ───── */
const products   = computed<Product[]>(() => store.products)
const categories = computed(() => [...new Set(products.value.map(p => p.category).filter(Boolean))].sort())

/* filtrage + tri chainé */
const displayed = computed<Product[]>(() => {
  let out = products.value

  const q = filters.value.search.toLowerCase()
  if (q) out = out.filter(p => (p.name+p.description).toLowerCase().includes(q))
  if (filters.value.category) out = out.filter(p => p.category === filters.value.category)
  if (filters.value.brand) out = out.filter(p => p.brand?.toLowerCase().includes(filters.value.brand.toLowerCase()))
  out = out.filter(p => p.price >= filters.value.priceMin && p.price <= filters.value.priceMax)
  if (filters.value.inStock) out = out.filter(p => p.stock_available > 0)

  return sortArray(out, sort.value)
})

const fetchProducts = async () => {
  loading.value = true
  try   { await store.fetchProducts() }
  catch (e:any){ error.value = e?.message || 'Erreur de chargement' }
  finally       { loading.value = false }
}

const sortProducts = () => router.replace({ query:{ ...route.query, sort: sort.value } })

const reset = () => { filters.value = { category:'',brand:'',search:'',priceMin:0,priceMax:Infinity,inStock:false } }

const sortArray = (arr:Product[], criteria:string) => {
  const sorted = [...arr]
  sorted.sort((a,b)=>{
    switch(criteria){
      case 'price_asc' : return a.price-b.price
      case 'price_desc': return b.price-a.price
      case 'name_asc'  : return a.name.localeCompare(b.name)
      case 'name_desc' : return b.name.localeCompare(a.name)
      case 'newest'    : return new Date(b.created_at??0).getTime()-new Date(a.created_at??0).getTime()
      default          : return (b.rating??0)-(a.rating??0)
    }
  })
  return sorted
}

/* ───── watchers / init ───── */
onMounted(fetchProducts)

watch(()=>route.query, () => {
  // sync UI ← URL
  filters.value.category = (route.query.category as string) || ''
  filters.value.search   = (route.query.q        as string) || ''
  sort.value             = (route.query.sort     as typeof sort.value) || 'popularity'
},{ immediate:true })

watch(filters, () => {
  // sync URL ← UI
  const q:any = { ...route.query }
  filters.value.search   ? q.q        = filters.value.search   : delete q.q
  filters.value.category ? q.category = filters.value.category : delete q.category
  router.replace({ query:q })
},{ deep:true })

/* ───── classes utilitaires ───── */
const gridCls = computed(()=> listView.value
    ? 'space-y-6' // liste
    : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4') // grille

const btnCls = (active:boolean)=>
    `p-2 rounded-md ${active?'bg-white text-blue-600 shadow':'text-gray-500 hover:text-gray-700'}`

</script>

<style scoped>
.btn-primary{ @apply inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700; }
</style>
