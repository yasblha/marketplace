<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm">
    <!-- ░░░ Barre info ░░░ -->
    <div class="bg-gradient-to-r from-primary-800 to-primary-600 text-white text-sm">
      <div class="container mx-auto flex items-center justify-between px-4 py-2">
        <p class="flex items-center gap-6">
          <span><i class="fas fa-phone-alt mr-1" /> +33 1 23 45 67 89</span>
          <span><i class="fas fa-envelope mr-1" /> contact@mambafit.com</span>
        </p>

        <nav class="flex items-center gap-4">
          <a
              v-for="s in soc"
              :key="s"
              href="#"
              class="hover:text-primary-200 transform hover:scale-110"
          >
            <i :class="`fab fa-${s}`" />
          </a>
          <button
              class="ml-4 p-1 rounded-full hover:bg-white/10"
              :title="isDark ? 'Mode clair' : 'Mode sombre'"
              @click="emit('toggle-dark-mode')"
          >
            <i :class="isDark ? 'fas fa-sun text-yellow-300' : 'fas fa-moon text-gray-300'" />
          </button>
        </nav>
      </div>
    </div>

    <!-- ░░░ Navigation ░░░ -->
    <nav class="bg-white">
      <div class="container mx-auto flex h-20 items-center justify-between px-4">
        <!-- Logo + burger -->
        <div class="flex items-center gap-2">
          <button
              class="md:hidden p-2 text-gray-600 hover:text-primary-600"
              @click="isMobile ? closeMenus() : openMobileMenu()"
              :aria-expanded="isMobile"
              aria-label="Menu"
          >
            <i class="fas fa-bars text-2xl" />
          </button>

          <RouterLink
              to="/"
              class="font-bold text-2xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
          >
            MAMBAFIT
          </RouterLink>
        </div>

        <!-- Liens desktop -->
        <nav class="hidden md:flex gap-1">
          <RouterLink
              v-for="l in main"
              :key="l.path"
              :to="l.path"
              exact-active-class="text-primary-600 font-semibold"
              class="px-4 py-2 font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50"
          >
            {{ l.title }}
          </RouterLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <!-- Recherche -->
          <button
              class="search-btn p-2 rounded-full text-gray-600 hover:text-primary-600"
              @click="toggleSearch"
              aria-label="Recherche"
          >
            <i class="fas fa-search text-xl" />
          </button>

          <!-- Wishlist -->
          <RouterLink to="/wishlist" class="relative p-2 text-gray-600 hover:text-primary-600">
            <i class="far fa-heart text-xl" />
            <span
                v-if="wCount"
                class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
            >
              {{ wCount }}
            </span>
          </RouterLink>

          <!-- Panier -->
          <RouterLink to="/cart" class="relative p-2 text-gray-600 hover:text-primary-600">
            <i class="fas fa-shopping-cart text-xl" />
            <span
                v-if="cCount"
                class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white"
            >
              {{ cCount }}
            </span>
          </RouterLink>

          <!-- Utilisateur -->
          <div class="relative">
            <button
                ref="btn"
                class="user-btn flex items-center gap-2 p-2 rounded-full text-gray-700 hover:text-primary-600"
                @click.stop="uMenu = !uMenu"
                :aria-expanded="uMenu"
                aria-haspopup="true"
                :aria-controls="'user-menu'"
            >
              <i class="fas fa-user-circle text-2xl" />
              <span class="hidden md:inline text-sm font-medium">{{ uInitials }}</span>
            </button>

            <Transition
                enter-active-class="transition duration-150"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-100"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
            >
              <div
                  v-if="uMenu"
                  ref="menu"
                  id="user-menu"
                  class="absolute right-0 mt-2 w-52 rounded-md border bg-white shadow-lg z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabindex="-1"
              >
                <template v-if="isAuth">
                  <RouterLink
                      to="/profile"
                      class="block px-4 py-2 text-sm hover:bg-gray-50"
                      @click="closeMenus"
                  >
                    Profil
                  </RouterLink>
                  <RouterLink
                      v-if="isAdmin"
                      to="/admin/dashboard"
                      class="block px-4 py-2 text-sm hover:bg-gray-50"
                      @click="closeMenus"
                  >
                    Admin
                  </RouterLink>
                  <button
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      @click="logout"
                  >
                    Déconnexion
                  </button>
                </template>
                <template v-else>
                  <button
                      class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      @click="openAuth('login')"
                  >
                    Connexion
                  </button>
                  <button
                      class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      @click="openAuth('register')"
                  >
                    Créer un compte
                  </button>
                </template>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Menu mobile -->
      <Transition
          enter-active-class="transition duration-150"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
      >
        <nav v-if="isMobile" ref="mob" class="md:hidden border-t bg-white py-4 shadow">
          <RouterLink
              v-for="l in mobLinks"
              :key="l.path"
              :to="l.path"
              class="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              @click="closeMenus"
          >
            {{ l.title }}
          </RouterLink>

          <template v-if="!isAuth">
            <button
                class="block w-full text-left px-4 py-3 text-base font-medium hover:bg-gray-50"
                @click="openAuth('login')"
            >
              Connexion
            </button>
            <button
                class="block w-full text-left px-4 py-3 text-base font-medium hover:bg-gray-50"
                @click="openAuth('register')"
            >
              Créer un compte
            </button>
          </template>

          <template v-else>
            <RouterLink
                to="/profile"
                class="block px-4 py-3 text-base font-medium hover:bg-gray-50"
                @click="closeMenus"
            >
              Profil
            </RouterLink>
            <RouterLink
                v-if="isAdmin"
                to="/admin/dashboard"
                class="block px-4 py-3 text-base font-medium hover:bg-gray-50"
                @click="closeMenus"
            >
              Admin
            </RouterLink>
            <button
                class="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-gray-50"
                @click="logout"
            >
              Déconnexion
            </button>
          </template>
        </nav>
      </Transition>
    </nav>

    <!-- Overlay recherche -->
    <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-if="showSearch"
          class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          @click.self="toggleSearch"
      >
        <div
            ref="sWrap"
            class="absolute left-1/2 top-24 w-[95%] max-w-2xl -translate-x-1/2 rounded-xl bg-white shadow-xl"
        >
          <div class="relative p-6">
            <input
                ref="sInput"
                v-model="sQuery"
                type="text"
                placeholder="Rechercher un produit…"
                class="w-full rounded-lg border px-4 py-3 pr-12 focus:ring-2 focus:ring-primary-500"
                @keyup.enter="goSearch"
            />
            <i class="fas fa-search absolute right-10 top-1/2 -translate-y-1/2 text-gray-400" />
            <button
                v-if="sQuery"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                @click="sQuery = ''"
            >
              <i class="fas fa-times" />
            </button>
          </div>

          <!-- Résultats -->
          <div v-if="sQuery">
            <!-- Chargement -->
            <div v-if="loading" class="flex justify-center py-6">
              <div class="h-6 w-6 animate-spin rounded-full border-b-2 border-primary-600" />
            </div>

            <!-- Suggestions -->
            <div v-else-if="results.length" class="max-h-80 divide-y overflow-y-auto">
              <button
                  v-for="p in results"
                  :key="p._id"
                  class="flex w-full items-center gap-3 px-6 py-3 hover:bg-gray-50"
                  @click="selectProduct(p)"
              >
                <img
                    :src="p.images?.[0] || fallback"
                    class="h-12 w-12 rounded-md object-cover"
                />
                <div class="flex-1 truncate text-left">
                  <p class="truncate font-medium">{{ p.name }}</p>
                  <p class="text-sm text-primary-600">{{ price(p.price) }}</p>
                </div>
              </button>
              <div class="px-6 py-3 text-right">
                <button class="text-primary-600 hover:underline" @click="goSearch">
                  Voir tous les résultats »
                </button>
              </div>
            </div>

            <!-- Aucun résultat -->
            <p v-else class="px-6 py-6 text-center text-gray-500">Aucun résultat.</p>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, defineProps, withDefaults } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore }       from '@/stores/user';
import { useAuthModalStore }  from '@/stores/authModale';
import { useCartStore }       from '@/stores/panier';
import { useWishlistStore }   from '@/stores/wishlist';
import { useProductStore }    from '@/stores/products';
import type { Product }       from '@/stores/products';
import axiosInstance from '@/services/api';

/* ---------- props / emit ---------- */
const props = withDefaults(defineProps<{
  isDark?: boolean;
}>(), {
  isDark: false
});
const emit = defineEmits<{ (e: 'toggle-dark-mode'): void }>();

/* ---------- stores ---------- */
const auth  = useAuthStore();
const modal = useAuthModalStore();
const cart  = useCartStore();
const wish  = useWishlistStore();
const prod  = useProductStore();

/* ---------- router ---------- */
const router = useRouter();
const route  = useRoute();

/* ---------- state ---------- */
const isMobile   = ref(false);
const uMenu      = ref(false);
const showSearch = ref(false);

const sQuery  = ref('');
const results = ref<Product[]>([]);
const loading = ref(false);

const btn   = ref<HTMLElement>();
const menu  = ref<HTMLElement>();
const mob   = ref<HTMLElement>();
const sWrap = ref<HTMLElement>();
const sInput= ref<HTMLInputElement>();

/* ---------- computed ---------- */
const isAuth  = computed(() => auth.isAuthenticated);
const isAdmin = computed(() => auth.user?.role === 'admin');
const cCount  = computed(() => cart.items.reduce((n, i) => n + i.quantity, 0));
const wCount  = computed(() => wish.items.length);
const uInitials = computed(() => {
  const u = auth.user;
  if (!u) return '?';
  const f = u.firstname?.[0] ?? '';
  const l = u.lastname?.[0] ?? '';
  return (f || l ? f + l : u.email?.[0] ?? '?').toUpperCase();
});

/* ---------- menu lists ---------- */
const main     = [ { title:'Accueil',path:'/' }, { title:'Boutique',path:'/products' }, { title:'Promotions',path:'/promotions' } ];
const mobLinks = [...main];
const soc      = ['facebook-f','twitter','instagram'];

/* ---------- helpers ---------- */
const price    = (n:number) => n.toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
const fallback = 'https://via.placeholder.com/80?text=No+Image';
const closeMenus = () => {
  isMobile.value = false;
  uMenu.value = false;
  showSearch.value = false;
  document.body.style.overflow = '';
};

const openMobileMenu = () => {
  isMobile.value = true;
  uMenu.value = false;
  showSearch.value = false;
  document.body.style.overflow = 'hidden';
};

/* ---------- auth ---------- */
const openAuth = (m:'login'|'register')=>{ modal.openModal(m); closeMenus(); };
const logout   = async()=>{ await auth.logout(); closeMenus(); router.push('/'); };

/* ---------- search logic ---------- */
const searchProducts = async (query: string) => {
  if (!query.trim()) {
    results.value = [];
    return;
  }
  
  loading.value = true;
  try {
    // Utiliser la fonction searchProducts du store
    await prod.searchProducts(query);
    
    // Récupérer les résultats du store
    const searchResults = prod.products;
    console.log('Résultats bruts de la recherche:', searchResults);
    
    // Vérifier si nous avons une réponse valide
    if (!searchResults) {
      console.warn('Aucun résultat de recherche');
      results.value = [];
      return;
    }
    
    // Vérifier si nous avons directement les tableaux sqlProducts et mongoProducts
    if (searchResults.sqlProducts || searchResults.mongoProducts) {
      const { sqlProducts = [], mongoProducts = [] } = searchResults;
      
      console.log('SQL Products:', sqlProducts);
      console.log('Mongo Products:', mongoProducts);
      
      // Formater les résultats SQL
      const formattedSql = Array.isArray(sqlProducts) ? sqlProducts.map((product: any) => {
        let imageUrl = null;
        
        // Gérer les images pour les produits SQL
        if (product.image) {
          try {
            const parsedImage = JSON.parse(product.image);
            imageUrl = Array.isArray(parsedImage) ? parsedImage[0] : parsedImage;
          } catch (e) {
            console.warn('Erreur lors du parsing de l\'image SQL:', e);
            imageUrl = product.image;
          }
        }
        
        return {
          _id: `sql-${product.id}`,
          name: product.name || 'Nom non disponible',
          brand: product.brand || 'Marque inconnue',
          category: product.category || 'Non catégorisé',
          price: parseFloat(product.price) || 0,
          image: imageUrl,
          source: 'sql'
        };
      }) : [];
      
      // Formater les résultats MongoDB
      const formattedMongo = Array.isArray(mongoProducts) ? mongoProducts.map((product: any) => ({
        _id: product._id,
        name: product.name || 'Nom non disponible',
        brand: product.brand || 'Marque inconnue',
        category: product.category || 'Non catégorisé',
        price: product.price || 0,
        image: (product.images && product.images.length > 0) ? product.images[0] : null,
        source: 'mongo'
      })) : [];
      
      // Combiner et filtrer pour ne garder que les résultats dont le nom correspond exactement à la recherche
      const allResults = [...formattedSql, ...formattedMongo];
      const normalizedQuery = query.trim().toLowerCase();
      const exactMatches = allResults.filter(product => 
        product.name.toLowerCase() === normalizedQuery
      );
      
      // Si on a des correspondances exactes, on les prend, sinon on garde les résultats initiaux
      results.value = exactMatches.length > 0 
        ? exactMatches.slice(0, 8) 
        : allResults.slice(0, 8);
    } else if (Array.isArray(searchResults)) {
      // Si c'est directement un tableau de résultats
      const allResults = searchResults.map((product: any) => {
        let imageUrl = null;
        
        // Essayer de déterminer la source (SQL ou MongoDB)
        const isMongo = '_id' in product;
        
        if (isMongo && product.images && product.images.length > 0) {
          // Produit MongoDB avec images
          imageUrl = product.images[0];
        } else if (product.image) {
          // Produit SQL avec image
          try {
            const parsedImage = JSON.parse(product.image);
            imageUrl = Array.isArray(parsedImage) ? parsedImage[0] : parsedImage;
          } catch (e) {
            console.warn('Erreur lors du parsing de l\'image:', e);
            imageUrl = product.image;
          }
        }
        
        return {
          _id: isMongo ? product._id : `sql-${product.id || product.postgres_id}`,
          name: product.name || 'Nom non disponible',
          brand: product.brand || 'Marque inconnue',
          category: product.category || 'Non catégorisé',
          price: product.price || 0,
          image: imageUrl,
          source: isMongo ? 'mongo' : 'sql'
        };
      });
      
      // Filtrer pour ne garder que les résultats dont le nom correspond exactement à la recherche
      const normalizedQuery = query.trim().toLowerCase();
      const exactMatches = allResults.filter((product: any) => 
        product.name.toLowerCase() === normalizedQuery
      );
      
      // Si on a des correspondances exactes, on les prend, sinon on garde les résultats initiaux
      results.value = exactMatches.length > 0 
        ? exactMatches.slice(0, 8)
        : allResults.slice(0, 8);
    } else {
      console.warn('Format de réponse inattendu:', searchResults);
      results.value = [];
    }
    
    console.log('Résultats formatés:', results.value);
    
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    results.value = [];
  } finally {
    loading.value = false;
  }
};

// Utilisation de watchDebounced pour limiter les appels API
watchDebounced(
  sQuery,
  (query) => {
    searchProducts(query);
  },
  { debounce: 300, maxWait: 1000 }
);

const toggleSearch = (event?: Event) => {
  if (event) event.stopPropagation();
  
  if (showSearch.value) {
    closeMenus();
    return;
  }
  
  showSearch.value = true;
  uMenu.value = false;
  isMobile.value = false;
  
  sQuery.value = '';
  results.value = [];
  
  nextTick(() => {
    sInput.value?.focus();
  });
};

const goSearch = () => {
  const query = sQuery.value.trim();
  if (query) {
    router.push({ 
      name: 'products', 
      query: { q: query } 
    });
  }
  closeMenus();
};
const selectProduct = (product: Product) => {
  if (product?._id) {
    router.push({ 
      name: 'product', 
      params: { id: product._id } 
    });
    closeMenus();
  }
};

/* ---------- global listeners ---------- */
const clickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  
  // Fermer le menu utilisateur si clic en dehors
  if (uMenu.value && btn.value && !btn.value.contains(target) && menu.value && !menu.value.contains(target)) {
    uMenu.value = false;
  }
  
  // Fermer le menu mobile si clic en dehors
  if (isMobile.value && mob.value && !mob.value.contains(target) && !target.closest('[aria-label="Menu"]')) {
    closeMenus();
  }
  
  // Fermer la recherche si clic en dehors
  const searchBtn = target.closest('.search-btn');
  if (showSearch.value && sWrap.value && !sWrap.value.contains(target) && !searchBtn) {
    closeMenus();
  }
};
const esc = (e:KeyboardEvent) => { if (e.key==='Escape') closeMenus(); };

onMounted(()=>{
  document.addEventListener('click',clickOutside);
  window.addEventListener('keydown',esc);
  cart.loadCart();
  // Vérifier si la méthode fetchWishlist existe avant de l'appeler
  if (wish && typeof wish.fetchWishlist === 'function') {
    wish.fetchWishlist();
  }
});
onUnmounted(()=>{
  document.removeEventListener('click',clickOutside);
  window.removeEventListener('keydown',esc);
});
</script>
