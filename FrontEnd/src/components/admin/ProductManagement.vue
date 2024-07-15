<!-- pages/AdminDashboard.vue -->
<template>
  <div>
    <button @click="showProductModal = true">Add Product</button>

    <Table
        :items="combinedProducts"
        :columns="columns"
        :itemsPerPage="10"
        :onView="viewProduct"
        :onEdit="editProduct"
        :onDelete="deleteProduct"
    />

    <Modal v-model="showProductModal" title="Add Product">
      <AddProductForm
          :initialData="selectedProduct"
          @product-added="onProductAdded"
          @product-updated="onProductUpdated"
      />
    </Modal>

    <Modal v-if="showProductDetailsModal" v-model="showProductDetailsModal" :title="selectedProduct?.name">
      <div>
        <p><strong>Category:</strong> {{ selectedProduct?.category }}</p>
        <p><strong>Brand:</strong> {{ selectedProduct?.brand }}</p>
        <p><strong>Price:</strong> {{ selectedProduct?.price }}</p>
        <p><strong>Stock:</strong> {{ selectedProduct?.stock_available }}</p>
        <p><strong>Status:</strong> {{ selectedProduct?.status }}</p>
        <p><strong>Description:</strong> {{ selectedProduct?.description }}</p>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useProductStore } from '@/stores/products';
import Table from '@/components/common/Table.vue';
import Modal from '@/components/common/Modale.vue';
import AddProductForm from '@/components/common/AddProductForm.vue';

interface Product {
  _id?: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock_available: number;
  status: string;
  image: string | null;
}

interface Column<T> {
  key: keyof T & string;
  label: string;
  searchable?: boolean;
}

const productStore = useProductStore();
const showProductModal = ref(false);
const showProductDetailsModal = ref(false);
const selectedProduct = ref<Partial<Product> | undefined>(undefined);

const combinedProducts = computed(() => {
  console.log('Computing combined products:', productStore.products);
  return productStore.products;
});

const modalTitle = computed(() => selectedProduct.value ? 'Edit Product' : 'Add Product');

const columns: Column<Product>[] = [
  { key: 'name', label: 'Name', searchable: true },
  { key: 'category', label: 'Category', searchable: true },
  { key: 'brand', label: 'Brand', searchable: true },
  { key: 'price', label: 'Price' },
  { key: 'stock_available', label: 'Stock' },
  { key: 'status', label: 'Status' }
];

onMounted(async () => {
  console.log('Component mounted, fetching products...');
  await productStore.fetchProducts();
  console.log('Products after fetch:', productStore.products);
});

watch(() => productStore.products, (newProducts) => {
  console.log('Products in store changed:', newProducts);
}, { deep: true });

const viewProduct = (product: Product) => {
  console.log('Viewing product:', product);
  selectedProduct.value = { ...product };
  showProductDetailsModal.value = true;
};

const editProduct = (product: Product) => {
  console.log('Editing product:', product);
  selectedProduct.value = { ...product };
  showProductModal.value = true;
};

const deleteProduct = async (product: Product) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      console.log('Deleting product:', product);
      await productStore.deleteProduct(product._id ?? '');
      console.log('Product deleted, refreshing list...');
      await productStore.fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
};

const onProductAdded = async () => {
  console.log('Product added, refreshing list...');
  showProductModal.value = false;
  await productStore.fetchProducts();
};

const onProductUpdated = async () => {
  console.log('Product updated, refreshing list...');
  showProductModal.value = false;
  selectedProduct.value = undefined;
  await productStore.fetchProducts();
};
</script>
