<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm">
    <div class="bg-gradient-to-r from-primary-800 to-primary-600 text-white text-sm">
      <div class="container mx-auto flex items-center justify-between px-4 py-2">
        <p class="flex items-center gap-6">
          <span><i class="fas fa-phone-alt mr-1" /> +33 1 23 45 67 89</span>
          <span><i class="fas fa-envelope mr-1" /> contact@mambafit.com</span>
        </p>
        <nav class="flex items-center gap-4">
          <a v-for="s in ['facebook-f','twitter','instagram']" :key="s" href="#" class="hover:text-primary-200 hover:scale-110">
            <i :class="`fab fa-${s}`" />
          </a>
          <button class="ml-4 p-1 rounded-full hover:bg-white/10" @click="$emit('toggle-dark-mode')">
            <i :class="isDark ? 'fas fa-sun text-yellow-300' : 'fas fa-moon text-gray-300'" />
          </button>
        </nav>
      </div>
    </div>

    <nav class="bg-white">
      <div class="container mx-auto flex h-20 items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <button class="md:hidden p-2 text-gray-600 hover:text-primary-600" aria-label="Menu" @click="isMobile ? closeAll() : openMobile()">
            <i class="fas fa-bars text-2xl" />
          </button>
          <RouterLink to="/" class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">MAMBAFIT</RouterLink>
        </div>

        <nav class="hidden md:flex gap-1">
          <RouterLink v-for="l in links" :key="l.p" :to="l.p" class="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50" exact-active-class="text-primary-600 font-semibold">
            {{ l.t }}
          </RouterLink>
        </nav>

        <div class="flex items-center gap-4">
          <button id="search-btn" class="p-2 rounded-full text-gray-600 hover:text-primary-600" @click="showSearch = !showSearch">
            <i class="fas fa-search text-xl" />
          </button>

          <RouterLink to="/wishlist" class="relative p-2 text-gray-600 hover:text-primary-600">
            <i class="far fa-heart text-xl" />
            <span v-if="wishQty" class="badge">{{ wishQty }}</span>
          </RouterLink>

          <RouterLink to="/cart" class="relative p-2 text-gray-600 hover:text-primary-600">
            <i class="fas fa-shopping-cart text-xl" />
            <span v-if="cartQty" class="badge bg-primary-600">{{ cartQty }}</span>
          </RouterLink>

          <div class="relative">
            <button id="user-btn" class="flex items-center gap-2 p-2 rounded-full text-gray-700 hover:text-primary-600" @click.stop="showUser = !showUser">
              <i class="fas fa-user-circle text-2xl" /><span class="hidden md:inline text-sm font-medium">{{ initials }}</span>
            </button>

            <transition name="fade">
              <div v-if="showUser" id="user-menu" class="abs-menu">
                <template v-if="isAuth">
                  <RouterLink to="/profile" class="menu-item" @click="closeAll">Profil</RouterLink>
                  <RouterLink v-if="isAdmin" to="/admin/dashboard" class="menu-item" @click="closeAll">Admin</RouterLink>
                  <button class="menu-item text-red-600" @click="logout">Déconnexion</button>
                </template>
                <template v-else>
                  <button class="menu-item" @click="openAuth('login')">Connexion</button>
                  <button class="menu-item" @click="openAuth('register')">Créer un compte</button>
                </template>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <transition name="fade">
        <nav v-if="isMobile" class="md:hidden border-t bg-white py-4 shadow">
          <RouterLink v-for="l in links" :key="l.p" :to="l.p" class="mobile-link" @click="closeAll">{{ l.t }}</RouterLink>
          <template v-if="!isAuth">
            <button class="mobile-link" @click="openAuth('login')">Connexion</button>
            <button class="mobile-link" @click="openAuth('register')">Créer un compte</button>
          </template>
          <template v-else>
            <RouterLink to="/profile" class="mobile-link" @click="closeAll">Profil</RouterLink>
            <RouterLink v-if="isAdmin" to="/admin/dashboard" class="mobile-link" @click="closeAll">Admin</RouterLink>
            <button class="mobile-link text-red-600" @click="logout">Déconnexion</button>
          </template>
        </nav>
      </transition>
    </nav>

    <transition name="fade">
      <div v-if="showSearch" class="overlay" @click.self="closeAll">
        <div ref="searchBox" class="search-box">
          <input ref="searchInput" v-model="query" class="search-input" placeholder="Rechercher un produit…" @keyup.enter="router.push({name:'products',query:{q:query.trim()}}); closeAll()" />
          <button v-if="query" class="clear" @click="query = ''"><i class="fas fa-times" /></button>

          <div v-if="query">
            <div v-if="loading" class="loader" />
            <p v-else-if="!results.length" class="empty">Aucun résultat.</p>
            <div v-else class="results">
              <button v-for="p in results" :key="p._id" class="result" @click="toProduct(p)">
                <img :src="p.images?.[0] || 'https://via.placeholder.com/40?text=Img'" class="h-10 w-10 rounded object-cover" />
                <span class="flex-1 truncate text-left">{{ p.name }}</span>
                <span class="text-primary-600">{{ p.price.toLocaleString('fr-FR',{style:'currency',currency:'EUR'}) }}</span>
              </button>
              <button class="see-all" @click="router.push({name:'products',query:{q:query.trim()}}); closeAll()">Voir tous les résultats »</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/user'
import { useAuthModalStore } from '@/stores/authModale'
import { useCartStore } from '@/stores/panier'
import { useWishlistStore } from '@/stores/wishlist'
import { useProductStore } from '@/stores/products'
import type { Product } from '@/types/product'

defineProps<{ isDark?: boolean }>()
const router = useRouter()
const auth   = useAuthStore()
const modal  = useAuthModalStore()
const cart   = useCartStore()
const wish   = useWishlistStore()
const prod   = useProductStore()

const links      = [{t:'Accueil',p:'/'},{t:'Boutique',p:'/products'},{t:'Promotions',p:'/promotions'}]
const isMobile   = ref(false)
const showUser   = ref(false)
const showSearch = ref(false)

const query   = ref('')
const results = ref<Product[]>([])
const loading = ref(false)

const searchBox   = ref<HTMLElement>()
const searchInput = ref<HTMLInputElement>()

const isAuth   = computed(() => auth.isAuthenticated)
const isAdmin  = computed(() => auth.user?.role === 'admin')
const cartQty  = computed(() => cart.items.reduce((t,i)=>t+i.quantity,0))
const wishQty  = computed(() => wish.items.length)
const initials = computed(() => {
  const u = auth.user
  return u ? (u.firstname?.[0] ?? u.email?.[0] ?? '?') + (u.lastname?.[0] ?? '') : '?'
})

const lock   = () => document.body.style.overflow = 'hidden'
const unlock = () => document.body.style.overflow = ''
const openMobile = () => { isMobile.value = true; lock() }
const closeAll   = () => { isMobile.value = showUser.value = showSearch.value = false; unlock() }

const openAuth = (m:'login'|'register') => { modal.openModal(m); closeAll() }
const logout   = async () => { await auth.logout(); closeAll(); router.push('/') }

const toProduct = (p:Product) => { router.push({name:'product',params:{id:p._id ?? p.id}}); closeAll() }

const doSearch = useDebounceFn(async (q:string)=>{
  if(!q.trim()){results.value=[];return}
  loading.value = true
  await prod.searchProducts(q)
  results.value = prod.products.slice(0,8)
  loading.value = false
},300)
watch(query,doSearch)

const onClick = (e:MouseEvent)=>{
  const t=e.target as HTMLElement
  if(showUser.value && !t.closest('#user-btn') && !t.closest('#user-menu')) closeAll()
  if(showSearch.value && searchBox.value && !searchBox.value.contains(t) && !t.closest('#search-btn')) closeAll()
  if(isMobile.value && !t.closest('nav.md\\:hidden') && !t.closest('[aria-label="Menu"]')) closeAll()
}
const onEsc = (e:KeyboardEvent)=>{if(e.key==='Escape')closeAll()}
onMounted(()=>{
  document.addEventListener('click',onClick)
  window.addEventListener('keydown',onEsc)
  cart.loadCart?.()
  wish.fetchWishlist?.()
  nextTick(()=>searchInput.value?.focus())
})
onUnmounted(()=>{
  document.removeEventListener('click',onClick)
  window.removeEventListener('keydown',onEsc)
})
</script>

<style scoped>
.badge{ @apply absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white }
.abs-menu{ @apply absolute right-0 mt-2 w-52 rounded-md border bg-white shadow-lg z-50 }
.menu-item{ @apply block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 }
.mobile-link{ @apply block px-4 py-3 text-base font-medium hover:bg-gray-50 }
.fade-enter-active,.fade-leave-active{ transition:all .15s ease }
.fade-enter-from,.fade-leave-to{ opacity:0; transform:scale(.95) }
.overlay{ @apply fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 }
.search-box{ @apply w-full max-w-2xl bg-white rounded-xl shadow-xl p-6 relative }
.search-input{ @apply w-full rounded-lg border px-4 py-3 pr-10 focus:ring-2 focus:ring-primary-500 }
.clear{ @apply absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 }
.loader{ @apply h-6 w-6 mx-auto my-6 animate-spin rounded-full border-b-2 border-primary-600 }
.results{ @apply max-h-80 divide-y overflow-y-auto mt-4 }
.result{ @apply w-full flex items-center gap-3 px-2 py-3 hover:bg-gray-50 }
.see-all{ @apply w-full text-right px-2 py-3 text-primary-600 hover:underline }
.empty{ @apply text-center py-6 text-gray-500 }
</style>
