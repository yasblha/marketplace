<template>
  <section class="min-h-screen bg-slate-100 pb-24">
    <div v-if="product" class="container mx-auto px-4 pt-10">
      <div class="flex flex-col lg:flex-row gap-10 bg-white p-6 shadow rounded-xl">
        <!-- Images -->
        <div class="flex-1">
          <img :src="mainImg" :alt="product.name" class="w-full max-w-lg mx-auto rounded-md object-contain" />

          <div v-if="imgList.length > 1" class="flex gap-3 mt-6 justify-center flex-wrap">
            <img
              v-for="(img, idx) in imgList"
              :key="idx"
              :src="img"
              :alt="`thumbnail-${idx}`"
              class="w-16 h-16 object-cover rounded border cursor-pointer transition hover:scale-105"
              :class="{ 'ring-2 ring-primary-600': img === mainImg }"
              @click="mainImg = img"
            />
          </div>
        </div>

        <!-- Details -->
        <div class="flex-1 space-y-6">
          <h1 class="text-3xl font-semibold leading-snug">{{ product.name }}</h1>

          <p class="text-2xl text-primary-600 font-medium">€{{ (+product.price).toFixed(2) }}</p>

          <p class="text-gray-700 whitespace-pre-line">{{ product.description }}</p>
          <p v-if="product.brand" class="text-sm text-gray-500">Brand: <span class="font-medium">{{ product.brand }}</span></p>

          <!-- Size options if clothing -->
          <div v-if="sizes.length" class="space-y-2">
            <p class="font-medium">Size</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="s in sizes"
                :key="s"
                @click="selectedSize = s"
                class="px-4 py-2 border rounded transition"
                :class="selectedSize === s ? 'bg-primary-600 text-white border-primary-600' : 'hover:bg-gray-100'"
              >{{ s }}</button>
            </div>
          </div>

          <!-- Quantity -->
          <div class="space-y-2">
            <p class="font-medium">Quantity</p>
            <div class="flex items-center gap-3">
              <button class="w-9 h-9 border rounded" @click="decQty">-</button>
              <span class="min-w-[2rem] text-center">{{ qty }}</span>
              <button class="w-9 h-9 border rounded" @click="incQty">+</button>
            </div>
          </div>

          <button
            class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
            :disabled="product.status !== 'available' || qty < 1"
            @click="addToCart"
          >
            Add to cart
          </button>

          <p class="text-sm text-gray-500">Availability: {{ product.status === 'available' ? 'In stock' : 'Out of stock' }}</p>
          
          <!-- Composant d'alertes produit -->
          <ProductAlerts v-if="product" :product="product" />
        </div>
      </div>
    </div>

    <div v-else class="flex justify-center items-center min-h-[50vh]">
      <div class="h-10 w-10 animate-spin rounded-full border-b-2 border-primary-600" />
    </div>

    <Footer />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { decodeBase64 } from '@/utils/encodage'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/panier'
import type { Product } from '@/types/product'
import Footer from '@/components/UI/Footer.vue'
import ProductAlerts from '@/components/Products/ProductAlerts.vue'
// @ts-ignore
import defaultImg from '@/assets/ui_assets/NoImage.jpg'

/* ───── stores & route ───── */
const prodStore = useProductStore()
const cart      = useCartStore()
const route     = useRoute()

/* ───── state ───── */
const product   = ref<Product | null>(null)
const imgList   = ref<string[]>([])
const mainImg   = ref<string>(defaultImg)
const qty       = ref<number>(1)

// simplistic size options – adapt if you have real data
const sizes          = ['S', 'M', 'L']
const selectedSize   = ref<string>(sizes[1])

/* ───── helpers ───── */
const apiBase = import.meta.env.VITE_APP_API_URL?.replace(/\/+$/, '') || ''
const normalizeImg = (src?: string | null): string => {
  if (!src) return defaultImg
  if (src.startsWith('http')) return src
  return `${apiBase}/${src.replace(/^\/+/, '')}`
}

/* ───── lifecycle ───── */
const id = decodeBase64(route.params.id as string)

onMounted(async () => {
  product.value = await prodStore.getProductById(id) as Product | null
  if (product.value) {
    const imgs = Array.isArray(product.value.images) && product.value.images.length ? product.value.images : []
    imgList.value = imgs.map(normalizeImg)
    if (!imgList.value.length && product.value.image) {
      const base = Array.isArray(product.value.image) ? product.value.image[0] : product.value.image
      imgList.value.push(normalizeImg(base))
    }
    mainImg.value = imgList.value[0] || defaultImg
  }
})

/* ───── actions ───── */
const incQty = () => qty.value++
const decQty = () => { if (qty.value > 1) qty.value-- }

const addToCart = () => {
  if (!product.value) return
  cart.add(product.value, qty.value)
}
</script>

<style scoped>
/***** Minimal additional styling; rely mainly on Tailwind *****/
</style>
