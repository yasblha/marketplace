<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm">
    <!-- Top Bar -->
    <div class="bg-gradient-to-r from-primary-800 to-primary-600 text-white text-sm">
      <div class="container mx-auto px-4 py-2 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <span><i class="fas fa-phone-alt mr-1"></i> +33 1 23 45 67 89</span>
          <span><i class="fas fa-envelope mr-1"></i> contact@mambafit.com</span>
        </div>
        <div class="flex items-center space-x-4">
          <a href="#" class="hover:text-primary-200 transition-colors transform hover:scale-110"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="hover:text-primary-200 transition-colors transform hover:scale-110"><i class="fab fa-twitter"></i></a>
          <a href="#" class="hover:text-primary-200 transition-colors transform hover:scale-110"><i class="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>

    <!-- Main Navigation -->
    <nav class="bg-white">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <router-link to="/" class="flex-shrink-0 flex items-center group">
            <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent transform transition-transform duration-300 group-hover:scale-105">MAMBAFIT</span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-2">
            <router-link 
              to="/"
              class="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 hover:bg-gray-50 rounded-lg"
              active-class="text-primary-600 font-semibold"
              exact
            >
              Accueil
            </router-link>
            <router-link 
              to="/products"
              class="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 hover:bg-gray-50 rounded-lg"
              active-class="text-primary-600 font-semibold"
            >
              Tous les produits
            </router-link>
          </div>

          <!-- Right Side Icons -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <button 
              @click="toggleSearch" 
              class="p-2 text-gray-600 hover:text-primary-600 transition-all duration-300 hover:bg-gray-100 rounded-full"
              :class="{ 'text-primary-600 bg-gray-100': showSearch }"
              aria-label="Rechercher"
            >
              <i class="fas fa-search text-xl"></i>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <button 
                ref="userMenuButtonRef"
                @click="toggleUserMenu" 
                class="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 transition-all duration-300 hover:bg-gray-100 rounded-full"
                :class="{ 'text-primary-600 bg-gray-100': showUserMenu }"
                aria-label="Menu utilisateur"
                aria-haspopup="true"
                :aria-expanded="showUserMenu"
              >
                <i class="fas fa-user-circle text-2xl"></i>
                <span class="hidden md:inline-block text-sm font-medium">{{ userInitials }}</span>
              </button>
              <!-- User Dropdown -->
              <transition
                enter-active-class="transition ease-out duration-100 transform"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75 transform"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div 
                  v-if="showUserMenu" 
                  ref="userMenuRef"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100"
                >
                  <div v-if="isAuthenticated" class="py-1">
                    <!-- User Info -->
                    <div class="px-4 py-3 border-b border-gray-100">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ user?.firstname }} {{ user?.lastname }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                    </div>
                    
                    <!-- Menu Items -->
                    <router-link 
                      to="/profile" 
                      class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 group transition-colors duration-150"
                      @click="showUserMenu = false"
                    >
                      <i class="fas fa-user-circle mr-3 text-gray-400 group-hover:text-primary-500 w-5 text-center"></i>
                      <span>Mon Profil</span>
                    </router-link>
                    
                    <router-link 
                      v-if="isAdmin"
                      to="/admin/dashboard" 
                      class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 group transition-colors duration-150"
                      @click="showUserMenu = false"
                    >
                      <i class="fas fa-tachometer-alt mr-3 text-gray-400 group-hover:text-primary-500 w-5 text-center"></i>
                      <span>Tableau de bord</span>
                    </router-link>
                    
                    <div class="border-t border-gray-100 my-1"></div>
                    
                    <button 
                      @click="logout"
                      class="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 group transition-colors duration-150"
                    >
                      <i class="fas fa-sign-out-alt mr-3 text-red-400 group-hover:text-red-600 w-5 text-center"></i>
                      <span>Déconnexion</span>
                    </button>
                  </div>
                  
                  <div v-else class="py-1">
                    <button 
                      @click="handleAuthClick('login')"
                      class="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 group transition-colors duration-150"
                    >
                      <i class="fas fa-sign-in-alt mr-3 text-gray-400 group-hover:text-primary-500 w-5 text-center"></i>
                      <span>Connexion</span>
                    </button>
                    
                    <button
                      @click="handleAuthClick('register')"
                      class="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 group transition-colors duration-150"
                    >
                      <i class="fas fa-user-plus mr-3 text-gray-400 group-hover:text-primary-500 w-5 text-center"></i>
                      <span>Créer un compte</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Wishlist -->
            <router-link 
              to="/wishlist" 
              class="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
              :class="{ 'text-primary-600': $route.path === '/wishlist' }"
            >
              <i class="far fa-heart text-xl"></i>
              <span v-if="wishlistCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {{ wishlistCount }}
              </span>
            </router-link>

            <!-- Cart -->
            <router-link 
              to="/cart" 
              class="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
              :class="{ 'text-primary-600': $route.path === '/cart' }"
            >
              <i class="fas fa-shopping-cart text-xl"></i>
              <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {{ cartCount }}
              </span>
            </router-link>

            <!-- Mobile Menu Button -->
            <button 
              @click="toggleMobileMenu"
              class="mobile-menu-button md:hidden text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Menu mobile"
              type="button"
            >
              <i class="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <transition
          enter-active-class="transition ease-out duration-100 transform"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75 transform"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="isMobileMenuOpen" 
            class="md:hidden bg-white border-t border-gray-100 shadow-lg py-4 animate-fade-in"
            ref="mobileMenuRef"
          >
            <div class="px-2 space-y-1">
              <router-link 
                v-for="link in mobileNav" 
                :key="link.path" 
                :to="link.path" 
                class="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg mx-2 group transition-colors duration-150"
                @click="isMobileMenuOpen = false"
                active-class="text-primary-600 bg-primary-50"
              >
                <i :class="`fas fa-${link.icon} mr-3 text-gray-400 group-hover:text-primary-500 w-5 text-center`"></i>
                <span>{{ link.title }}</span>
              </router-link>
              
              <!-- Mobile Auth Links -->
              <template v-if="!isAuthenticated">
                <button 
                  @click="[openAuthModal('login'), isMobileMenuOpen = false]"
                  class="w-full text-left flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg mx-2 group transition-colors duration-150"
                >
                  <i class="fas fa-sign-in-alt mr-3 text-gray-400 group-hover:text-primary-500 w-5 text-center"></i>
                  <span>Connexion</span>
                </button>
                
                <button
                  @click="[openAuthModal('register'), isMobileMenuOpen = false]"
                  class="w-full text-left flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg mx-2 group transition-colors duration-150"
                >
                  <i class="fas fa-user-plus mr-3 text-gray-400 group-hover:text-primary-500 w-5 text-center"></i>
                  <span>Créer un compte</span>
                </button>
              </template>
              
              <template v-else>
                <router-link 
                  to="/profile"
                  class="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg mx-2 group transition-colors duration-150"
                  @click="isMobileMenuOpen = false"
                >
                  <i class="fas fa-user-circle mr-3 text-gray-400 group-hover:text-primary-500 w-5 text-center"></i>
                  <span>Mon Profil</span>
                </router-link>
                
                <router-link 
                  v-if="isAdmin"
                  to="/admin/dashboard"
                  class="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg mx-2 group transition-colors duration-150"
                  @click="isMobileMenuOpen = false"
                >
                  <i class="fas fa-tachometer-alt mr-3 text-gray-400 group-hover:text-primary-500 w-5 text-center"></i>
                  <span>Tableau de bord</span>
                </router-link>
                
                <button 
                  @click="[logout(), isMobileMenuOpen = false]"
                  class="w-full text-left flex items-center px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg mx-2 group transition-colors duration-150"
                >
                  <i class="fas fa-sign-out-alt mr-3 text-red-400 group-hover:text-red-600 w-5 text-center"></i>
                  <span>Déconnexion</span>
                </button>
              </template>
            </div>
          </div>
        </transition>

        <!-- Search Bar Overlay -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div 
            v-if="showSearch"
            class="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
            @click="toggleSearch"
          >
            <div 
              class="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-2xl"
              @click.stop
              ref="searchRef"
            >
              <div class="relative">
                <input 
                  ref="searchInputRef"
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Rechercher des produits..." 
                  class="search-input w-full px-6 py-4 pr-16 text-lg rounded-xl shadow-xl border-0 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none transition-all duration-200"
                  @keyup.enter="performSearch"
                  autofocus
                >
                <button 
                  @click="performSearch"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-colors"
                  aria-label="Rechercher"
                >
                  <i class="fas fa-search text-xl"></i>
                </button>
              </div>
              <div v-if="searchSuggestions.length > 0" class="mt-2 bg-white rounded-xl shadow-lg overflow-hidden">
                <div 
                  v-for="suggestion in searchSuggestions" 
                  :key="suggestion.id"
                  class="px-6 py-3 hover:bg-gray-50 cursor-pointer flex items-center"
                  @click="goToProduct(suggestion)"
                >
                  <img :src="suggestion.image" :alt="suggestion.name" class="w-10 h-10 object-cover rounded-md mr-3">
                  <div>
                    <div class="font-medium text-gray-900">{{ suggestion.name }}</div>
                    <div class="text-sm text-gray-500">{{ formatPrice(suggestion.price) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router';
import { useAuthStore } from '@/stores/user';
import { useAuthModalStore } from '@/stores/authModale';
import { useCartStore } from '@/stores/panier';
import { useWishlistStore } from '@/stores/wishlist';

// Types
interface SearchSuggestion {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface NavItem {
  title: string;
  path: string;
  icon?: string;
}

// Router and stores
const route = useRoute();
const router = useRouter();
const authModalStore = useAuthModalStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

// UI state
const isMobileMenuOpen = ref<boolean>(false);
const showUserMenu = ref<boolean>(false);
const showSearch = ref<boolean>(false);
const searchQuery = ref<string>('');

// Refs for click outside detection
const searchInput = ref<HTMLInputElement | null>(null);
const searchOverlay = ref<HTMLDivElement | null>(null);
const mobileMenuRef = ref<HTMLDivElement | null>(null);
const userMenuButtonRef = ref<HTMLButtonElement | null>(null);
const userMenuRef = ref<HTMLDivElement | null>(null);
const searchRef = ref<HTMLDivElement | null>(null);

// Computed properties
const isAuthenticated = computed<boolean>(() => authStore.isAuthenticated);
const isAdmin = computed<boolean>(() => authStore.user?.role === 'admin');
const cartCount = computed<number>(() => cartStore.items.reduce((total, item) => total + item.quantity, 0));
const wishlistCount = computed<number>(() => wishlistStore.items.length);

// Navigation links
const mainNav: NavItem[] = [
  { title: 'Accueil', path: '/' },
  { title: 'Boutique', path: '/products' },
  { title: 'Femme', path: '/category/femme' },
  { title: 'Homme', path: '/category/homme' },
  { title: 'Équipement', path: '/category/equipement' },
  { title: 'Nutrition', path: '/category/nutrition' },
  { title: 'Promotions', path: '/promotions' },
];

// Mobile navigation links
const mobileNav: NavItem[] = [
  { title: 'Accueil', path: '/', icon: 'home' },
  { title: 'Tous les produits', path: '/products', icon: 'shopping-bag' },
];

// Reactive state
const searchSuggestions = ref<SearchSuggestion[]>([]);
const isSearching = ref<boolean>(false);

// User initials
const userInitials = computed<string>(() => {
  if (!authStore.user) return '?';
  const user = authStore.user as { firstname?: string; lastname?: string; email?: string };
  const firstname = user?.firstname || '';
  const lastname = user?.lastname || '';
  const email = user?.email || '';
  
  if (firstname && lastname) {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  }
  if (email) return email.charAt(0).toUpperCase();
  return '?';
});

// Search products
const searchProducts = async (query: string): Promise<void> => {
  if (!query.trim()) {
    searchSuggestions.value = [];
    return;
  }
  
  isSearching.value = true;
  try {
    // Simuler une API call - À remplacer par un vrai appel API
    // const response = await api.searchProducts(query);
    // searchSuggestions.value = response.data;
    
    // Simulation de données
    searchSuggestions.value = [
      { id: 1, name: 'Produit de test 1', price: 49.99, image: 'https://via.placeholder.com/50' },
      { id: 2, name: 'Autre produit', price: 29.99, image: 'https://via.placeholder.com/50' },
    ];
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    searchSuggestions.value = [];
  } finally {
    isSearching.value = false;
  }
};

// Watch search query changes
watchDebounced(
  searchQuery,
  (newQuery: string) => {
    searchProducts(newQuery);
  },
  { debounce: 300, maxWait: 1000 }
);

// Perform search
const performSearch = (): void => {
  if (searchQuery.value.trim()) {
    router.push({ 
      name: 'products', 
      query: { q: searchQuery.value } 
    } as RouteLocationRaw);
    showSearch.value = false;
    searchQuery.value = '';
    searchSuggestions.value = [];
  }
};

// Go to product page
const goToProduct = (product: SearchSuggestion): void => {
  const route: RouteLocationRaw = { 
    name: 'product', 
    params: { id: product.id.toString() } 
  };
  router.push(route);
  showSearch.value = false;
  searchQuery.value = '';
  searchSuggestions.value = [];
};

// Auth methods
const openAuthModal = (mode: 'login' | 'register'): void => {
  authModalStore.openModal(mode);
};

const handleAuthClick = (mode: 'login' | 'register'): void => {
  openAuthModal(mode);
  showUserMenu.value = false;
};

const logout = async (): Promise<void> => {
  await authStore.logout();
  showUserMenu.value = false;
  if (route.meta.requiresAuth) {
    router.push('/');
  }
};

// Toggle search overlay
const toggleSearch = (event?: MouseEvent): void => {
  event?.stopPropagation();
  showSearch.value = !showSearch.value;
  
  if (showSearch.value) {
    // Close other menus when opening search
    showUserMenu.value = false;
    isMobileMenuOpen.value = false;
    
    // Focus the search input when search is opened
    nextTick(() => {
      if (searchInput.value) {
        searchInput.value.focus();
      }
    });
  } else {
    searchQuery.value = '';
    searchSuggestions.value = [];
  }
};

// Toggle user menu
const toggleUserMenu = (event?: MouseEvent): void => {
  event?.stopPropagation();
  showUserMenu.value = !showUserMenu.value;
  
  // Close other menus when opening this one
  if (showUserMenu.value) {
    isMobileMenuOpen.value = false;
    showSearch.value = false;
  }
};

// Close user menu when clicking outside
const closeUserMenu = (event: Event): void => {
  if (
    userMenuButtonRef.value && 
    !userMenuButtonRef.value.contains(event.target as Node) &&
    userMenuRef.value &&
    !userMenuRef.value.contains(event.target as Node) &&
    showUserMenu.value
  ) {
    showUserMenu.value = false;
  }
}

// Handle click outside to close menus
const handleClickOutside = (event: Event): void => {
  const target = event.target as HTMLElement;
  
  if (userMenuRef.value && !userMenuRef.value.contains(target)) {
    showUserMenu.value = false;
  }
  
  if (mobileMenuRef.value && !mobileMenuRef.value.contains(target) && !target.closest('.mobile-menu-button')) {
    isMobileMenuOpen.value = false;
  }
  
  if (showSearch.value && searchRef.value && !searchRef.value.contains(target) && !target.closest('.search-button')) {
    showSearch.value = false;
    searchQuery.value = '';
    searchSuggestions.value = [];
  }
};

// Handle escape key press
const handleEscape = (e: KeyboardEvent): void => {
  if (e.key === 'Escape') {
    if (showSearch.value) {
      showSearch.value = false;
      searchQuery.value = '';
      searchSuggestions.value = [];
    }
    if (showUserMenu.value) {
      showUserMenu.value = false;
    }
    if (isMobileMenuOpen.value) {
      isMobileMenuOpen.value = false;
    }
  }
};

// Add/remove event listeners
onMounted(async (): Promise<void> => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('click', closeUserMenu);
  window.addEventListener('keydown', handleEscape);
  
  // Charger le panier et la wishlist
  try {
    if (authStore.isAuthenticated) {
      await cartStore.loadCartFromBackend();
    } else {
      cartStore.loadCart();
    }
    await wishlistStore.fetchWishlist();
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
});

// Cleanup event listeners
onUnmounted((): void => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('click', closeUserMenu);
  window.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
/* User menu dropdown */
.user-menu-container {
  @apply origin-top-right right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none;
}

/* Search bar */
.search-input {
  @apply block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm;
}

/* Cart and wishlist counters */
.counter-badge {
  @apply absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-600 text-xs font-medium text-white;
}

/* Mobile menu button */
.mobile-menu-button {
  @apply inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500;
}

/* Navigation links */
.nav-link {
  @apply px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200;
}

.nav-link.router-link-active {
  @apply text-primary-600 border-b-2 border-primary-600;
}

/* Dropdown item */
.dropdown-item {
  @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer;
}

/* Auth buttons */
.auth-button {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

/* User avatar */
.user-avatar {
  @apply h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm;
}

/* Mobile menu */
.mobile-menu {
  @apply px-2 pt-2 pb-3 space-y-1;
}

.mobile-menu-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50;
}

.mobile-menu-link.router-link-active {
  @apply bg-gray-100 text-primary-600;
}

/* Search overlay */
.search-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200 ease-in-out;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

/* Transition for menus */
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Search bar focus effect */
.search-input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Smooth transitions for interactive elements */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom scrollbar for dropdowns */
.dropdown-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.dropdown-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.dropdown-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Pulse animation for loading states */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Sticky header */
.sticky {
  position: sticky;
  top: 0;
  z-index: 50;
  transition: all 0.3s ease;
}

/* Hide scrollbar but allow scrolling */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom scrollbar for dropdowns */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .hidden-mobile {
    display: none !important;
  }
}

/* Accessibility focus styles */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Print styles */
@media print {
  header {
    display: none !important;
  }
}
</style>
