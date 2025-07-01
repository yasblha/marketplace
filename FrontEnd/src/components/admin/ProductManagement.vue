<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <div class="mb-4 space-x-3">
      <button class="btn-primary" @click="openProductForm">Ajouter un produit</button>
      <button class="btn-success" @click="inject">Injecter des produits</button>
    </div>

    <Table
        :items="products"
        :columns="columns"
        :items-per-page="10"
        @view="showDetails"
        @edit="openEditForm"
        @delete="removeProduct"
    />

    <Modal v-model="showForm" :title="formTitle">
      <AddProductForm
          :initial-data="current"
          @product-added="refresh"
          @product-updated="refresh"
      />
    </Modal>

    <Modal v-model="showDetailsModal" :title="current?.name">
      <div class="flex flex-col gap-6 md:flex-row">
        <img
            :src="image(current)"
            alt=""
            class="mx-auto w-full max-w-xs rounded-lg border object-contain"
        />
        <dl class="flex-1 space-y-2 text-sm">
          <div v-for="f in fields" :key="f.k" class="flex justify-between">
            <dt class="font-medium">{{ f.l }}</dt>
            <dd>{{ (current as any)[f.k] ?? '—' }}</dd>
          </div>
        </dl>
      </div>
      <div class="mt-6">
        <button class="btn-success" @click="openStockModal">Gestion de stock</button>
      </div>
    </Modal>

    <Modal v-model="showStockModal" title="Gestion de stock">
      <StockHistoryTable :product-id="current?.id || current?._id" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { useAuthStore } from '@/stores/user'
import Table from '@/components/common/Table.vue'
import Modal from '@/components/common/Modale.vue'
import AddProductForm from '@/components/common/AddProductForm.vue'
import type { Product } from '@/types/product'
import StockHistoryTable from '@/components/admin/StockHistoryTable.vue'

const defaultImg = '/src/assets/NoImage.jpg'
const store      = useProductStore()
const auth       = useAuthStore()

const showForm         = ref(false)
const showDetailsModal = ref(false)
const showStockModal   = ref(false)
const current          = ref<Partial<Product> | undefined>()

const products = computed(() => store.products)

const formTitle = computed(() => (current.value ? 'Modifier le produit' : 'Ajouter un produit'))

const columns: { key: keyof Product; label: string; searchable?: boolean }[] = [
  { key: 'name',             label: 'Nom',        searchable: true },
  { key: 'category',         label: 'Catégorie',  searchable: true },
  { key: 'brand',            label: 'Marque',     searchable: true },
  { key: 'price',            label: 'Prix' },
  { key: 'stock_available',  label: 'Stock' },
  { key: 'status',           label: 'Statut' }
]

const fields = [
  { k: 'category',        l: 'Catégorie' },
  { k: 'brand',           l: 'Marque' },
  { k: 'price',           l: 'Prix' },
  { k: 'stock_available', l: 'Stock' },
  { k: 'status',          l: 'Statut' },
  { k: 'description',     l: 'Description' }
]

onMounted(async () => {
  await Promise.all([store.fetchProducts(), auth.fetchUsers()])
})

const openProductForm = () => {
  current.value = undefined
  showForm.value = true
}
const openEditForm = (p: Product) => {
  current.value = { ...p }
  showForm.value = true
}
const showDetails = (p: Product) => {
  current.value = { ...p }
  showDetailsModal.value = true
}
const removeProduct = async (p: Product) => {
  if (confirm('Supprimer ce produit ?')) {
    await store.deleteProduct(String(p._id ?? p.id))
    await store.fetchProducts()
  }
}
const inject = async () => {
  console.warn('Méthode injectProducts non implémentée');
  await store.fetchProducts()
}
const refresh = async () => {
  showForm.value = false
  current.value = undefined
  await store.fetchProducts()
}

const image = (p?: Partial<Product>) => {
  if (!p) return defaultImg;
  const images = p.images;
  if (images && images.length > 0) {
    return images[0];
  }
  return defaultImg;
}

const openStockModal = () => { showStockModal.value = true }
</script>

<style scoped>
.btn-primary,
.btn-success {
  @apply inline-flex items-center justify-center px-5 py-2 rounded-md font-medium shadow-sm transition active:translate-y-px;
}
.btn-primary { @apply bg-blue-600 text-white hover:bg-blue-700; }
.btn-success { @apply bg-emerald-600 text-white hover:bg-emerald-700; }
</style>
