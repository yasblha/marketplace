<template>
  <nav class="navbar">
    <div class="title">
      <router-link class="navbar-brand" to="/home">MAMBAFIT</router-link>
    </div>

    <div class="links">
      <li class="nav-item"><router-link class="nav-link" to="/home">Home</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/products">Shop</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/about">About</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/blog">Blog</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/contact">Contact</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/Products">Products</router-link></li>
    </div>

    <ul class="linkTwo">
      <li v-if="!isAuthenticated" class="nav-item">
        <a class="nav-link2" href="#" @click.prevent="$emit('openAuthModal')">Login</a>
      </li>
      <li v-else class="nav-item profile-menu">
        <img src="@/assets/ui_assets/user.svg" alt="profile" @click="toggleMenu" />
        <ul v-if="showMenu" class="profile-dropdown">
          <li><router-link to="/profile">Profile</router-link></li>
          <li v-if="isAdmin"><router-link to="/admin/dashboard">Dashboard</router-link></li>
          <li><a href="#" @click.prevent="logout">Logout</a></li>
        </ul>
      </li>
      <li class="nav-item"><router-link class="nav-link2" to="/cart"><img src="../../assets/ui_assets/Panier.svg" alt="cart"></router-link></li>
      <li class="nav-item"><router-link class="nav-link2" to="/wishlist"><img src="../../assets/ui_assets/hart.svg" alt="wishlist"></router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useAuthStore } from '@/stores/user';

const emit = defineEmits(['openAuthModal']);
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.user && authStore.user.role === 'admin');

console.log('isAuthenticated:', isAuthenticated.value);
console.log('isAdmin:', isAdmin.value);

const showMenu = ref(false);
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const logout = () => {
  authStore.logout();
};

watchEffect(() => {
  console.log('Auth state changed, isAuthenticated:', isAuthenticated.value);
  console.log('User role:', authStore.user ? authStore.user.role : 'No user');
});
</script>

<style scoped>
.navbar {
  display: flex;
  width: 100%;
  background-color: white;
  padding: 19px;
  color: black;
}

.title {
  margin: auto;
  font-size: 20px;
}

.links {
  display: flex;
  text-decoration: none;
  list-style: none;
  color: black;
  margin: auto;
}

.title a {
  color: rgba(37, 43, 66, 1);
  font-weight: 700;
}

.links li {
  margin-left: 18px;
}

.linkTwo {
  display: flex;
  margin: auto;
}

.linkTwo li {
  list-style: none;
  margin-left: 14px;
}

.links li a {
  color: rgba(115, 115, 115, 1);
}

.linkTwo li a {
  color: #23a6f0;
  font-weight: 500;
}

.profile-menu {
  position: relative;
}

.profile-menu img {
  width: 20px;
  height: 20px;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 10px;
  border-radius: 4px;
  width: 150px;
}

.profile-dropdown li {
  padding: 10px;
}

.profile-dropdown li a {
  color: black;
  text-decoration: none;
}

.profile-dropdown li a:hover {
  text-decoration: underline;
}
</style>
