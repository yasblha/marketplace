<template>
  <div class="flex min-h-screen bg-gray-50 ">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div class="p-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800">Mon Compte</h2>
      </div>
      <nav class="mt-4">
        <ul class="space-y-1 px-2">
          <li v-for="(item, index) in menuItems" :key="index">
            <a 
              href="#" 
              @click.prevent="setActiveMenu(item.id)" 
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="currentTab === item.id 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'"
            >
              <svg 
                class="w-5 h-5 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                :class="currentTab === item.id ? 'text-blue-500' : 'text-gray-400'"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  :d="item.icon"
                />
              </svg>
              <span>{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
    <!-- Main Content -->
    <main class="flex-1 p-6 bg-gray-50">
      <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <component :is="currentComponent" :user="user" :addresses="addresses" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/user';
import Profile from '@/components/profil/Profile.vue';
import Orders from '@/components/profil/Commandes.vue';
import PaymentMethods from '@/components/profil/MéthodesPayment.vue';
import Security from '@/components/profil/Security.vue';
import Addresses from '@/components/profil/Adresses.vue';
import Preferences from '@/components/profil/Preferences.vue';

const currentTab = ref('profile');

const menuItems = [
  { id: 'profile', label: 'Mon Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'orders', label: 'Mes Commandes', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { id: 'payment-methods', label: 'Moyens de Paiement', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { id: 'addresses', label: 'Mes Adresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'security', label: 'Sécurité', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { id: 'preferences', label: 'Préférences', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z' },
];

const componentsMap: Record<string, any> = {
  profile: Profile,
  orders: Orders,
  'payment-methods': PaymentMethods,
  addresses: Addresses,
  security: Security,
  preferences: Preferences,
};

const currentComponent = computed(() => componentsMap[currentTab.value]);

const setActiveMenu = (menu: string) => {
  currentTab.value = menu;
};

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const addresses = ref([]);
</script>

<style scoped>
/* Transitions personnalisées */
.router-enter-active,
.router-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.router-enter-from,
.router-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
