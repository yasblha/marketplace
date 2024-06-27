<template>
  <div>
    <h2>User Management</h2>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
}

const users = ref<User[]>([]);

const fetchUsers = () => {
  setTimeout(() => {
    users.value = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    ];
  }, 1000);
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* Styles spécifiques pour UserManagement.vue */
</style>
