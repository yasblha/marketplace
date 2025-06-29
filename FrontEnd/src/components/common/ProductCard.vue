<template>
  <div
      class="product-card group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

    <!-- promo -->
    <span v-if="product.discount"
          class="absolute right-3 top-3 z-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-2 py-1 text-xs font-bold text-white">
      -{{ product.discount }}%
    </span>

    <!-- image -->
    <div class="relative bg-gray-100 pt-[100%]">
      <div v-if="!imgLoaded" class="absolute inset-0 animate-pulse bg-gray-200"/>
      <img :src="productImg" :alt="product.name" @load="imgLoaded=true"
           class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
           :class="{'opacity-0':!imgLoaded}" />

      <!-- nouveau -->
      <span v-if="isNew" class="absolute left-3 top-3 z-10 rounded bg-blue-500 px-2 py-1 text-xs font-bold text-white">
        Nouveau
      </span>

      <!-- quick actions -->
      <div
          class="absolute inset-0 flex items-center justify-center gap-3 bg-black/30 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <button @click.stop="toggleWishlist"
                :class="['action-btn', inWishlist ? 'bg-white text-red-500' : 'bg-white text-gray-800' ]"
                :title="inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'">
          <i :class="[ inWishlist ? 'fas' : 'far', 'fa-heart']"/>
        </button>

        <button @click.stop="goDetails" class="action-btn bg-white text-gray-800" title="Voir les détails">
          <i class="fas fa-eye"/>
        </button>

        <button 
  @click.stop="addToCart" 
  :disabled="!inStock || cart.loading"
  :class="[
    'action-btn text-white flex items-center justify-center', 
    inStock 
      ? 'bg-blue-600 hover:bg-blue-700' 
      : 'cursor-not-allowed bg-gray-400',
    cart.loading ? 'opacity-70' : ''
  ]"
  :title="inStock ? 'Ajouter au panier' : 'Produit indisponible'"
>
  <template v-if="true">
    <i v-if="!cart.loading" class="fas fa-shopping-cart"/>
    <i v-else class="fas fa-spinner fa-spin"></i>
  </template>
</button>
      </div>
    </div>

    <!-- infos -->
    <div class="flex flex-1 flex-col p-4">
      <span v-if="product.category" class="mb-1 text-xs font-medium text-blue-600">{{ product.category }}</span>

      <h3 class="mb-1 line-clamp-2 font-semibold text-gray-900" :title="product.name">{{ product.name }}</h3>
      <p v-if="product.brand" class="mb-2 text-sm text-gray-500">{{ product.brand }}</p>

      <div class="mt-auto space-y-1">
        <div class="flex items-end gap-2">
          <span class="text-lg font-bold text-gray-900">{{ format(price) }}</span>
          <span v-if="originalPrice" class="text-sm text-gray-500 line-through">{{ originalPrice }}</span>
        </div>

        <p v-if="showStockInfo" :class="stockCls" class="text-sm">{{ stockTxt }}</p>

        <p v-if="showShippingInfo" class="flex items-center gap-1 text-xs text-gray-500">
          <i class="fas fa-truck text-blue-500"/> {{ product.free_shipping ? 'Livraison gratuite' : 'Frais de port en sus' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore }      from '@/stores/panier'
import { useWishlistStore }  from '@/stores/wishlist'
import { encodeBase64 } from '@/utils/encodage'

interface Product {
  id?: string | number
  _id?: string | number
  name: string
  brand: string
  category?: string
  price: number
  discount?: number
  stock_available: number
  stock_total?: number
  images?: string[]
  created_at?: string | Date
  free_shipping?: boolean
  rating?: number
  reviewCount?: number
  slug?: string
  description?: string
}

const props = withDefaults(defineProps<{
  product:         Product
  showStockInfo?:  boolean
  showShippingInfo?: boolean
}>(), {
  showStockInfo:  true,
  showShippingInfo: true
})

/* ───── stores & router ───── */
const cart      = useCartStore()
const wishlist  = useWishlistStore()
const router    = useRouter()

/* ───── état local ───── */
const imgLoaded = ref(false)

/* ───── helpers ───── */
const format = (n:number)=>n.toLocaleString('fr-FR',{style:'currency',currency:'EUR'})
const price  = computed(()=> props.product.price * (1 - (props.product.discount??0)/100))
const originalPrice = computed(()=> props.product.discount ? format(props.product.price) : '')
const inStock  = computed(()=> props.product.stock_available > 0)
const inWishlist = computed(()=> wishlist.isInWishlist(String(props.product.id)))
const isNew   = computed(()=>{
  const c = props.product.created_at
  return c ? (Date.now()-+new Date(c))/864e5 < 30 : false
})
const stockTxt  = computed(()=> inStock.value ? 'En stock' : 'Rupture')
const stockCls  = computed(()=> inStock.value ? 'text-green-600' : 'text-red-600')

/* ───── image ───── */
const productImg = computed(()=>{
  const src = props.product.images?.[0] ?? ''
  if (/^https?:\/\//.test(src)) return src
  const api = (import.meta.env.VITE_APP_API_URL||'').replace(/\/$/,'')
  return src ? `${api}/${src.replace(/^\/+/,'')}` : '/NoImage.jpg'
})

/* ───── actions ───── */
const addToCart = async () => {
  if (cart.loading) return; // Prevent multiple clicks

  try {
    const result = await cart.add({
      ...props.product,
      _id: String(props.product.id || props.product._id || ''),
      id: String(props.product.id || props.product._id || ''),
      price: price.value,
      images: [productImg.value],
      description: props.product.description || '',
      category: props.product.category || '',
      brand: props.product.brand || '',
      stock_available: props.product.stock_available || 0,
      created_at: typeof props.product.created_at === 'string' ? props.product.created_at : undefined
    }, 1);

    if (result) {
      // Afficher une notification de succès
      // Vous pouvez utiliser un système de notification comme toast ou une alerte
      console.log('Produit ajouté au panier');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    // Afficher un message d'erreur à l'utilisateur
  }
}

const toggleWishlist = ()=> inWishlist.value
    ? wishlist.removeFromWishlist(String(props.product.id))
    : wishlist.addToWishlist({id:String(props.product.id),name:props.product.name,price:price.value,image:productImg.value})

const goDetails = () => {
  if (props.product.slug) {
    router.push(`/products/${props.product.slug}`)
  } else {
    let id:any = props.product.id ?? props.product._id
    if (typeof id === 'string' && id.startsWith('pg_')) id = id.slice(3)
    router.push(`/product/${encodeBase64(String(id))}`)
  }
}
</script>

<style scoped>
.action-btn{
  @apply flex h-10 w-10 items-center justify-center rounded-full shadow transition hover:scale-110;
}
</style>
