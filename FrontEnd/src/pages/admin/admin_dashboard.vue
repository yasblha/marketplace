<template>
  <div class="min-h-screen bg-gray-100 flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <div 
      :class="[
        'fixed inset-y-0 left-0 transform',
        state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:static md:flex md:flex-shrink-0',
        'transition-transform duration-200 ease-in-out',
        'w-64 bg-gray-800 text-white flex flex-col z-20'
      ]"
    >
      <div class="flex items-center justify-between h-16 px-4 bg-gray-900">
        <h1 class="text-xl font-semibold">Admin Panel</h1>
        <button @click="toggleSidebar" class="md:hidden text-gray-400 hover:text-white">
          <XIcon class="h-6 w-6" />
        </button>
      </div>
      
      <nav class="flex-1 overflow-y-auto">
        <div class="space-y-1 px-2 py-4">
          <!-- Lien vers la page d'accueil -->
          <a 
            href="/"
            class="group flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <i class="fas fa-home mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300"></i>
            Retour au site
          </a>
          
          <div class="border-t border-gray-700 my-2"></div>
          
          <button 
            v-for="item in state.navigation" 
            :key="item.id"
            @click="setActiveSection(item.id)"
            :class="[
              state.activeSection === item.id 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'group flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left'
            ]"
          >
            <component 
              :is="item.icon" 
              :class="[
                state.activeSection === item.id ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                'mr-3 flex-shrink-0 h-6 w-6'
              ]" 
              aria-hidden="true" 
            />
            {{ item.name }}
          </button>
        </div>
      </nav>
      
      <!-- User profile dropdown -->
      <div class="p-4 border-t border-gray-700">
        <div class="flex items-center">
          <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {{ userInitials }}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-white">{{ userName }}</p>
            <p class="text-xs font-medium text-gray-400">Administrateur</p>
          </div>
        </div>
        <button 
          @click="logout"
          class="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Déconnexion
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top navigation -->
      <header class="bg-white shadow-sm z-10">
        <div class="px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <!-- Mobile menu button -->
            <button 
              @click="toggleSidebar" 
              class="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <MenuAlt2Icon class="h-6 w-6" />
            </button>
            
            <h1 class="text-xl font-semibold text-gray-900">
              {{ activeSectionData.name || 'Tableau de bord' }}
            </h1>
            
            <div class="flex items-center space-x-4">
              <!-- Search Bar -->
              <div class="relative hidden md:block">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  v-model="state.searchQuery"
                  @keyup.enter="handleSearch"
                  placeholder="Rechercher..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <!-- Notifications -->
              <button class="p-2 text-gray-500 hover:text-gray-700 focus:outline-none relative">
                <BellIcon class="h-6 w-6" />
                <span v-if="state.unreadNotifications > 0" class="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              <!-- User menu -->
              <div class="relative ml-3 user-menu">
                <div>
                  <button 
                    @click="toggleUserMenu"
                    class="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span class="sr-only">Ouvrir le menu utilisateur</span>
                    <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {{ userInitials }}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content area -->
      <main class="flex-1 overflow-y-auto focus:outline-none bg-gray-50">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <!-- Page title and actions -->
            <div class="md:flex md:items-center md:justify-between mb-6">
              <div class="flex-1 min-w-0">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  {{ activeSectionData.name || 'Tableau de bord' }}
                </h2>
              </div>

            </div>

            <!-- Stats Cards -->
            <div v-if="state.activeSection === 'dashboard'" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div 
                v-for="stat in state.stats" 
                :key="stat.id"
                class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div class="p-5">
                  <div class="flex items-center">
                    <div :class="`p-3 rounded-md ${stat.bgColor} bg-opacity-10`">
                      <component 
                        :is="stat.icon" 
                        :class="`h-6 w-6 ${stat.iconColor}`" 
                        aria-hidden="true"
                      />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        {{ stat.name }}
                      </dt>
                      <dd class="flex items-baseline">
                        <div class="text-2xl font-semibold text-gray-900">
                          {{ stat.id === 'revenue' || stat.id === 'sales' ? `${stat.value} €` : stat.value }}
                        </div>
                        <div 
                          :class="[
                            stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                            'ml-2 flex items-baseline text-sm font-semibold px-2 py-0.5 rounded-full',
                          ]"
                        >
                          <component 
                            :is="stat.changeType === 'increase' ? ArrowUpIcon : ArrowDownIcon" 
                            class="self-center flex-shrink-0 h-3 w-3 mr-1"
                            :class="stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                            aria-hidden="true"
                          />
                          <span class="sr-only">
                            {{ stat.changeType === 'increase' ? 'Augmenté de' : 'Diminué de' }}
                          </span>
                          {{ stat.change }}%
                        </div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dynamic component -->
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ activeSectionData.name || 'Tableau de bord' }}
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  {{ getSectionDescription(state.activeSection) }}
                </p>
              </div>
              <div class="px-4 py-5 sm:p-6">
                <component :is="activeComponent" v-if="!state.isLoading" />
                <div v-else class="flex justify-center py-12">
                  <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              </div>
            </div>

            <div v-if="state.activeSection === 'dashboard'">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatsSalesChart :data="salesByMonth.data" :labels="salesByMonth.labels" />
                <StatsDonutChart :data="productsByCategory.data" :labels="productsByCategory.labels" />
                <StatsBarChart :data="ordersByMonth.data" :labels="ordersByMonth.labels" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/user';
import { useProductStore } from '@/stores/products';
import { useOrderStore } from '@/stores/Commande';
import ProductManagement from '@/components/admin/ProductManagement.vue';
import UserManagement from '@/components/admin/UserManagement.vue';
import OrderManagement from '@/components/admin/OrderManagement.vue';
import ListItems from '@/components/admin/ListItems.vue';
import StatsSalesChart from '@/components/admin/StatsSalesChart.vue';
import StatsDonutChart from '@/components/admin/StatsDonutChart.vue';
import StatsBarChart from '@/components/admin/StatsBarChart.vue';
import ReportSection from '@/components/admin/ReportSection.vue'
import SettingsSection from '@/components/admin/SettingsSection.vue';

// Icons
import {
  ShoppingCartIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyEuroIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  HomeIcon,
  Squares2X2Icon as ViewGridIcon,
  UserGroupIcon,
  Cog6ToothIcon as CogIcon,
  ChartBarIcon,
  MagnifyingGlassIcon as SearchIcon,
  BellIcon,
  XMarkIcon as XIcon,
  Bars3BottomLeftIcon as MenuAlt2Icon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline';

// Composants
const components = {
  ProductManagement,
  UserManagement,
  OrderManagement,
  ListItems,
  ReportSection,
  SettingsSection
};

// Router et stores
const router = useRouter();
const authStore = useAuthStore();
const productStore = useProductStore();
const orderStore = useOrderStore();

// État de l'application
const state = ref({
  isSidebarOpen: false,
  isUserMenuOpen: false,
  activeSection: 'dashboard',
  searchQuery: '',
  unreadNotifications: 3,
  isLoading: true,
  stats: [
    { 
      id: 'sales',
      name: 'Ventes totales', 
      value: '24,567', 
      change: '12', 
      changeType: 'increase',
      icon: ShoppingCartIcon,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      id: 'orders',
      name: 'Commandes', 
      value: '1,234', 
      change: '5', 
      changeType: 'increase',
      icon: ShoppingBagIcon,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      id: 'customers',
      name: 'Clients', 
      value: '2,345', 
      change: '3', 
      changeType: 'decrease',
      icon: UsersIcon,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    { 
      id: 'revenue',
      name: 'Revenu mensuel', 
      value: '45,678', 
      change: '8', 
      changeType: 'increase',
      icon: CurrencyEuroIcon,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ],
  navigation: [
    { id: 'dashboard', name: 'Tableau de bord', icon: HomeIcon },
    { id: 'products', name: 'Produits', icon: ViewGridIcon },
    { id: 'orders', name: 'Commandes', icon: ShoppingBagIcon },
    { id: 'users', name: 'Utilisateurs', icon: UserGroupIcon },
    { id: 'reports', name: 'Rapports', icon: ChartBarIcon },
    { id: 'settings', name: 'Paramètres', icon: CogIcon }
  ]
});

// Getters
const user = computed(() => authStore.user || { 
  firstname: 'Admin', 
  lastname: 'User',
  email: 'admin@example.com' 
});

const userName = computed(() => {
  return user.value ? `${user.value.firstname || ''} ${user.value.lastname || ''}`.trim() || user.value.email || 'Admin' : 'Admin';
});

const userInitials = computed(() => {
  if (!userName.value) return 'A';
  return userName.value
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

const activeSectionData = computed(() => {
  return state.value.navigation.find(item => item.id === state.value.activeSection) || {};
});

const activeComponent = computed(() => {
  const section = state.value.activeSection;
  if (section === 'products') return ProductManagement;
  if (section === 'users') return UserManagement;
  if (section === 'orders') return OrderManagement;
  if (section === 'settings') return SettingsSection;
  if (section === 'reports') return ReportSection;
  return null;
});

// Méthodes
const toggleSidebar = () => {
  state.value.isSidebarOpen = !state.value.isSidebarOpen;
};

const toggleUserMenu = () => {
  state.value.isUserMenuOpen = !state.value.isUserMenuOpen;
};

const setActiveSection = (sectionId) => {
  state.value.activeSection = sectionId;
  // Fermer le menu sur mobile après sélection
  if (window.innerWidth < 768) {
    state.value.isSidebarOpen = false;
  }
};

const handleSearch = () => {
  // Implémenter la recherche
  console.log('Recherche:', state.value.searchQuery);
};

const logout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Échec de la déconnexion:', error);
  }
};

const handleResize = () => {
  // Ajuster la sidebar en fonction de la taille de l'écran
  if (window.innerWidth >= 768) {
    state.value.isSidebarOpen = true;
  } else {
    state.value.isSidebarOpen = false;
  }
};

const handleAdminClickOutside = (event) => {
  // Fermer le menu utilisateur si on clique en dehors
  const userMenu = document.querySelector('.user-menu');
  if (userMenu && !userMenu.contains(event.target)) {
    state.value.isUserMenuOpen = false;
  }
};

const getSectionDescription = (sectionId) => {
  const descriptions = {
    dashboard: 'Aperçu des statistiques et des activités récentes',
    products: 'Gérez les produits de votre catalogue',
    orders: 'Consultez et gérez les commandes des clients',
    users: 'Gérez les comptes utilisateurs et les autorisations',
    reports: 'Consultez les rapports et analyses',
    settings: 'Configurez les paramètres de votre boutique'
  };
  return descriptions[sectionId] || 'Gérez cette section depuis le panneau d\'administration';
};

// Hooks de cycle de vie
onMounted(async () => {
  // Charger les données initiales
  state.value.isLoading = true;
  try {
    await Promise.all([
      productStore.fetchProducts(),
      orderStore.fetchOrders(),
      // Ajouter d'autres appels API si nécessaire
    ]);
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  } finally {
    state.value.isLoading = false;
  }

  // Configurer les écouteurs d'événements
  window.addEventListener('resize', handleResize);
  document.addEventListener('click', handleAdminClickOutside);
  
  // Initialiser la taille de l'écran
  handleResize();
});

// Nettoyage des écouteurs d'événements lors du démontage du composant
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleAdminClickOutside);
});

// Ventes par mois (pour StatsSalesChart)
const salesByMonth = computed(() => {
  const map = new Map<string, number>()
  orderStore.orders.forEach(order => {
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

// Commandes par mois (pour StatsBarChart)
const ordersByMonth = computed(() => {
  const map = new Map<string, number>()
  orderStore.orders.forEach(order => {
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

// Répartition produits par catégorie (pour StatsDonutChart)
const productsByCategory = computed(() => {
  const map = new Map<string, number>()
  productStore.products.forEach(p => {
    map.set(p.category || 'Autre', (map.get(p.category || 'Autre') || 0) + 1)
  })
  const labels = Array.from(map.keys())
  return {
    labels,
    data: labels.map(l => map.get(l) || 0)
  }
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Smooth transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Responsive sidebar */
@media (max-width: 1023px) {
  .sidebar {
    @apply fixed inset-y-0 left-0 transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 w-64;
  }
  
  .sidebar-open {
    @apply translate-x-0;
  }
  
  .sidebar-backdrop {
    @apply fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden;
  }
}
</style>
