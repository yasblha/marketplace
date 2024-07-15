<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <div class="logo">
        <img src="../assets/logo.svg" alt="Logo" />
        <span>Admin Dashboard</span>
      </div>
      <ul class="menu">
        <li @click="activeMenu = 'products'" :class="{ 'active': activeMenu === 'products' }">
          <i class="fas fa-box-open"></i> Products
        </li>
        <li @click="activeMenu = 'users'" :class="{ 'active': activeMenu === 'users' }">
          <i class="fas fa-users"></i> Users
        </li>
        <li @click="activeMenu = 'list'" :class="{ 'active': activeMenu === 'list' }">
          <i class="fas fa-list"></i> List
        </li>
        <li @click="logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </li>
      </ul>
    </div>

    <div class="main-content">
      <div v-if="activeMenu === 'products'" class="dashboard-section">
        <h2>Product Management</h2>
        <ProductManagement />
      </div>
      <div v-else-if="activeMenu === 'users'" class="dashboard-section">
        <h2>User Management</h2>
        <UserManagement />
      </div>
      <div v-else-if="activeMenu === 'list'" class="dashboard-section">
        <h2>List Items</h2>
        <ListItems />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductManagement from '@/components/admin/ProductManagement.vue';
import UserManagement from '@/components/admin/UserManagement.vue';
import ListItems from '@/components/admin/ListItems.vue';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const activeMenu = ref('products');
const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  try {
    await authStore.logout();
    router.push('/');
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

.sidebar {
  width: 250px;
  background-color: #001529;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar .logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.sidebar .logo img {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.sidebar .logo span {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.menu {
  list-style: none;
  width: 100%;
  padding: 0;
}

.menu li {
  width: 100%;
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s, transform 0.3s;
  color: #ffffff;
}

.menu li:hover {
  background-color: #1890ff;
  transform: translateX(5px);
}

.menu li.active {
  background-color: #1890ff;
}

.menu li i {
  margin-right: 10px;
  color: #ffffff;
}

.main-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.dashboard-section {
  background-color: white;
  padding: 30px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.dashboard-section h2 {
  color: #001529;
  margin-bottom: 20px;
  font-size: 24px;
}
</style>
