<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
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
      </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div v-if="activeMenu === 'products'" class="dashboard-section">
        <h2>Add Products</h2>
        <!-- Component for adding products -->
        <AddProducts />
      </div>
      <div v-else-if="activeMenu === 'users'" class="dashboard-section">
        <h2>User Management</h2>
        <!-- Component for user management -->
        <UserManagement />
      </div>
      <div v-else-if="activeMenu === 'list'" class="dashboard-section">
        <h2>List Items</h2>
        <!-- Component for listing items -->
        <ListItems />
      </div>
    </div>
  </div>
</template>

<script setup>

import AddProducts from '@/components/admin/AddProducts.vue';
import UserManagement from '@/components/admin/UserManagement.vue';
import ListItems from '@/components/admin/ListItems.vue';

import { ref } from 'vue';

const activeMenu = ref('products'); // Default active menu

</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #333;
  color: white;
  padding-top: 20px;
}

.sidebar .logo {
  text-align: center;
  margin-bottom: 20px;
}

.sidebar .logo img {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.sidebar .logo span {
  font-size: 18px;
}

.menu {
  list-style: none;
  padding: 0;
}

.menu li {
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu li:hover {
  background-color: #555;
}

.menu li.active {
  background-color: #007bff;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.dashboard-section {
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
}

.dashboard-section h2 {
  color: #333;
  margin-bottom: 15px;
}

</style>
