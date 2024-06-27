<template>
  <div>
    <h2>List Items</h2>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }} - {{ item.description }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Item {
  id: number;
  name: string;
  description: string;
}

const items = ref<Item[]>([]);

const fetchItems = () => {
  setTimeout(() => {
    items.value = [
      { id: 1, name: 'Item 1', description: 'Description de l\'élément 1' },
      { id: 2, name: 'Item 2', description: 'Description de l\'élément 2' },
    ];
  }, 1000);
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
/* Styles spécifiques pour ListItems.vue */
</style>
