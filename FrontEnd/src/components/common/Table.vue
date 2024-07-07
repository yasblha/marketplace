<template>
  <div class="table-container">
    <div class="table-controls">
      <button class="btn-export" @click="exportCSV">Exporter CSV</button>
      <button class="btn-delete" @click="deleteSelected" :disabled="selectedItems.length === 0">Supprimer la sélection</button>
    </div>
    <div class="table-responsive">
      <table>
        <thead>
        <tr>
          <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
          <th v-for="column in columns" :key="column.key">
            <div class="table-header">
              {{ column.label }}
              <button class="btn-sort" @click="sort(column.key)">Trier</button>
              <input v-if="column.searchable" class="input-search" :placeholder="`Rechercher ${column.label}`" @input="search(column.key, $event)" />
            </div>
          </th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in paginatedItems" :key="item.id">
          <td><input type="checkbox" v-model="selectedItems" :value="item.id" /></td>
          <td v-for="column in columns" :key="column.key">{{ item[column.key] }}</td>
          <td>
            <div class="table-actions">
              <button class="btn-view" @click="viewItem(item)">Voir</button>
              <button class="btn-edit" @click="editItem(item)">Modifier</button>
              <DeleteButton :onDelete="() => deleteItem(item)" />
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button class="btn-pagination" @click="prevPage" :disabled="currentPage === 1">Précédent</button>
      <span class="pagination-text">Page {{ currentPage }} sur {{ totalPages }}</span>
      <button class="btn-pagination" @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DeleteButton from "@/components/common/DeteleButton.vue";
import { defineProps } from 'vue';

interface Column {
  key: string;
  label: string;
  searchable?: boolean;
}

const props = defineProps<{
  items: any[];
  columns: { key: string; label: string; searchable?: boolean }[];
  itemsPerPage: number;
  onView: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => Promise<void>;
}>();

console.log(props.items);

const currentPage = ref(1);
const sortKey = ref<string>('');
const sortOrder = ref<'asc' | 'desc'>('asc');
const searchFilters = ref<Record<string, string>>({});
const selectedItems = ref<string[]>([]);
const selectAll = ref(false);

const filteredItems = computed(() => {
  return props.items.filter(item =>
      Object.entries(searchFilters.value).every(([key, value]) =>
          String(item[key]).toLowerCase().includes(value.toLowerCase())
      )
  );
});

const sortedItems = computed(() => {
  if (!sortKey.value) return filteredItems.value;
  return [...filteredItems.value].sort((a, b) => {
    if (a[sortKey.value] < b[sortKey.value]) return sortOrder.value === 'asc' ? -1 : 1;
    if (a[sortKey.value] > b[sortKey.value]) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const totalPages = computed(() => Math.ceil(sortedItems.value.length / props.itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return sortedItems.value.slice(start, end);
});

const sort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const search = (key: string, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  if (value) {
    searchFilters.value[key] = value;
  } else {
    delete searchFilters.value[key];
  }
  currentPage.value = 1;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const viewItem = (item: any) => props.onView(item);
const editItem = (item: any) => props.onEdit(item);
const deleteItem = async (item: any) => {
  await props.onDelete(item);
  // Mettre à jour la liste des items après la suppression
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = sortedItems.value.map(item => item.id);
  } else {
    selectedItems.value = [];
  }
};

const deleteSelected = async () => {
  for (const id of selectedItems.value) {
    const item = props.items.find(i => i.id === id);
    if (item) await props.onDelete(item);
  }
  selectedItems.value = [];
};

const exportCSV = () => {
  const headers = props.columns.map(col => col.label).join(',');
  const rows = selectedItems.value.length > 0
      ? props.items.filter(item => selectedItems.value.includes(item.id))
      : props.items;
  const csv = [
    headers,
    ...rows.map(item => props.columns.map(col => item[col.key]).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
</script>

<style scoped>
.table-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-export,
.btn-delete {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-right: 10px;
  cursor: pointer;
}

.btn-delete:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

thead {
  background-color: #f2f2f2;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  position: relative;
}

.table-header {
  display: flex;
  align-items: center;
}

.btn-sort {
  background-color: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  margin-left: 10px;
}

.btn-sort:hover {
  text-decoration: underline;
}

.input-search {
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.input-search:focus {
  outline: none;
  border-color: #007bff;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.btn-pagination {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-right: 10px;
  cursor: pointer;
}

.pagination-text {
  font-size: 14px;
  vertical-align: middle;
}
</style>
