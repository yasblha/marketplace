<template>
  <div>
    <h1>Product Management</h1>
    <button @click="showProductModal = true">Add Product</button>

    <Table
        :items="products"
        :columns="columns"
        :itemsPerPage="10"
        :onView="viewProduct"
        :onEdit="editProduct"
        :onDelete="deleteProduct"
    />

    <Modal v-model="showProductModal" :title="modalTitle">
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
        <!-- Add other fields as needed -->
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProductStore } from '@/stores/products';
import Table from '@/components/common/Table.vue';
import Modal from '@/components/common/Modale.vue';
import AddProductForm from '@/components/common/AddProductForm.vue';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock_available: number;
  status: string;
  image?: string;
}

const productStore = useProductStore();
const showProductModal = ref(false);
const showProductDetailsModal = ref(false);
const selectedProduct = ref<Product | null>(null);

const products = computed(() => productStore.products);
const modalTitle = computed(() => selectedProduct.value ? 'Edit Product' : 'Add Product');

const columns = [
  { key: 'name', label: 'Name', searchable: true },
  { key: 'category', label: 'Category', searchable: true },
  { key: 'brand', label: 'Brand', searchable: true },
  { key: 'price', label: 'Price' },
  { key: 'stock_available', label: 'Stock' },
  { key: 'status', label: 'Status' }
];

const viewProduct = (product: Product) => {
  selectedProduct.value = { ...product };
  showProductDetailsModal.value = true;
};

const editProduct = (product: Product) => {
  selectedProduct.value = { ...product };
  showProductModal.value = true;
};

const deleteProduct = async (product: Product) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productStore.deleteProduct(product._id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
};

const onProductAdded = () => {
  showProductModal.value = false;
  productStore.fetchAllProducts();
};

const onProductUpdated = () => {
  showProductModal.value = false;
  selectedProduct.value = null;
  productStore.fetchAllProducts();
};
</script>
