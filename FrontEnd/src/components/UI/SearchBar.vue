<template>
  <div class="breadcrumb-search">
    <div class="breadcrumb">
      <a href="#">Home</a>
      <img src="@/assets/ui_assets/Fleche.svg" alt="breadcrumb separator">
      <a href="#">Shop</a>
    </div>
    <div class="search-bar">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Search products..."
      />
      <button @click="$emit('search', searchQuery)">Search</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref<string>('');
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

.breadcrumb-search {
  padding: 20px 110px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 16px auto;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
  font-family: 'Montserrat', sans-serif;
}

.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb a {
  margin-left: 12px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: #23a6f0;
}

.breadcrumb img {
  margin: 0 8px;
}

.search-bar {
  display: flex;
  align-items: center;
}

.search-bar input {
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  border-color: #23a6f0;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background-color: #1d94d2;
}

@media (max-width: 768px) {
  .breadcrumb-search {
    flex-direction: column;
    align-items: flex-start;
  }

  .breadcrumb,
  .search-bar {
    width: 100%;
    margin-top: 10px;
  }

  .breadcrumb {
    justify-content: flex-start;
  }

  .search-bar {
    justify-content: flex-end;
  }

  .search-bar input {
    width: 100%;
    margin-right: 0;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .search-bar button {
    width: 100%;
    border-radius: 4px;
  }
}
</style>
