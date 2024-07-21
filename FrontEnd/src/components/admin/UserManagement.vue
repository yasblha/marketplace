<template>
  <div class="user-management">
    <h2>User Management</h2>
    <div v-if="isLoading" class="loading">Loading users...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id" class="user-item">
        <div class="user-details">
          <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
          <span class="user-email">{{ user.email }}</span>
          <span class="user-role">{{ user.role }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/user';

const authStore = useAuthStore();
const users = ref([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const fetchUsers = async () => {
  try {
    await authStore.fetchUser();
    users.value = [authStore.user];
  } catch (err) {
    error.value = 'Failed to load users';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-management {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #001529;
  margin-bottom: 20px;
}

.loading {
  color: #1890ff;
  font-size: 16px;
}

.error {
  color: red;
  font-size: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.user-item {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.user-item:last-child {
  border-bottom: none;
}

.user-details {
  display: flex;
  justify-content: space-between;
}

.user-name {
  font-weight: bold;
}

.user-email {
  color: #555;
}

.user-role {
  color: #888;
}
</style>
