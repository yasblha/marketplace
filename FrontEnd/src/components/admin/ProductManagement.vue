<template>
  <div>
    <button class="add-product-button" @click="showProductModal = true">Add Product</button>
    <button class="inject-products-button" @click="handleInjectProducts">Inject Products</button>

    <Table
        :items="combinedProducts"
        :columns="columns"
        :itemsPerPage="10"
        @view="viewProduct"
        @edit="editProduct"
        @delete="deleteProduct"
    />

    <Modal v-model="showProductModal" :title="modalTitle">
      <AddProductForm
          :initialData="selectedProduct"
          @product-added="onProductAdded"
          @product-updated="onProductUpdated"
      />
    </Modal>

    <Modal v-if="showProductDetailsModal" v-model="showProductDetailsModal" :title="selectedProduct?.name">
      <div class="product-details-modal">
        <div class="image-section">
          <img :src="getImage(selectedProduct)" alt="Product Image" class="product-details-image" v-if="selectedProduct?.images?.length">
        </div>
        <div class="info-section">
          <h3 class="product-details-title">{{ selectedProduct?.name }}</h3>
          <p><strong>Category:</strong> {{ selectedProduct?.category }}</p>
          <p><strong>Brand:</strong> {{ selectedProduct?.brand }}</p>
          <p><strong>Price:</strong> {{ selectedProduct?.price }}</p>
          <p><strong>Stock:</strong> {{ selectedProduct?.stock_available }}</p>
          <p><strong>Status:</strong> {{ selectedProduct?.status }}</p>
          <p><strong>Description:</strong> {{ selectedProduct?.description }}</p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useProductStore } from '@/stores/products';
import { useAuthStore } from '@/stores/user';

import Table from '@/components/common/Table.vue';
import Modal from '@/components/common/Modale.vue';
import AddProductForm from '@/components/common/AddProductForm.vue';
import type { Product } from '@/stores/products';

interface Column<T> {
  key: keyof T & string;
  label: string;
  searchable?: boolean;
}

const productStore = useProductStore();
const authStore = useAuthStore();

const showProductModal = ref(false);
const showProductDetailsModal = ref(false);
const selectedProduct = ref<Partial<Product> | undefined>(undefined);

const combinedProducts = computed(() => productStore.products);

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
  await productStore.fetchProducts();
  await authStore.fetchUsers();
});

watch(() => productStore.products, (newProducts) => {
  console.log('Products in store changed:', newProducts);
}, { deep: true });

import { backendUrl } from '@/utils/backend';

const getImage = (product: Partial<Product> | undefined) => {
  if (product?.images && product.images.length > 0) {
    return `${backendUrl}/${product.images[0]}`;
  }
  return 'path/to/default/image.jpg';
};

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
      await productStore.deleteProduct(product._id ?? '');
      await productStore.fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
};

const handleInjectProducts = async () => {
  try {
    const message = await productStore.injectProducts();
    alert(message);
  } catch (error) {
    alert('Failed to inject products');
  }
};

const onProductAdded = async () => {
  showProductModal.value = false;
  await productStore.fetchProducts();
};

const onProductUpdated = async () => {
  showProductModal.value = false;
  selectedProduct.value = undefined;
  await productStore.fetchProducts();
};
</script>

<style scoped>
.add-product-button,
.inject-products-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.5;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-right: 0.75rem;
  margin-bottom: 1rem;
}

.add-product-button {
  background-color: #3b82f6;
  color: white;
}

.add-product-button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.inject-products-button {
  background-color: #10b981;
  color: white;
}

.inject-products-button:hover {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.product-details-modal {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  max-width: 900px;
  margin: 0 auto;
}

.image-section {
  flex: 1;
  text-align: center;
  margin-bottom: 1.5rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #f1f5f9;
}

.product-details-image {
  width: 100%;
  max-width: 350px;
  height: auto;
  margin: 0 auto;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;
  border: 1px solid #f1f5f9;
}

.product-details-image:hover {
  transform: scale(1.02);
}

.info-section {
  flex: 2;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  border: 1px solid #f1f5f9;
}

.product-details-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  text-align: left;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.product-details-modal p {
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.6;
  color: #475569;
}

.product-details-modal p strong {
  color: #334155;
  font-weight: 500;
  margin-right: 0.5rem;
  display: inline-block;
  min-width: 140px;
  font-weight: 500;
}

/* Table Styles */
:deep(.table-container) {
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  margin-top: 1.5rem;
}

:deep(table) {
  width: 100%;
  border-collapse: collapse;
}

:deep(th) {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

:deep(td) {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  font-size: 0.9375rem;
}

:deep(tr:last-child td) {
  border-bottom: none;
}

:deep(.action-buttons) {
  display: flex;
  gap: 0.5rem;
}

:deep(.action-button) {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

:deep(.view-button) {
  background-color: #3b82f6;
  color: white;
}

:deep(.edit-button) {
  background-color: #f59e0b;
  color: white;
}

:deep(.delete-button) {
  background-color: #ef4444;
  color: white;
}

:deep(.action-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Responsive Design */
@media (min-width: 768px) {
  .product-details-modal {
    flex-direction: row;
    gap: 2rem;
  }
  
  .image-section {
    margin-bottom: 0;
    max-width: 400px;
  }
  
  .product-details-image {
    max-width: 100%;
  }
}

@media (max-width: 767px) {
  .add-product-button,
  .inject-products-button {
    width: 100%;
    margin-right: 0;
  }
  
  :deep(.action-buttons) {
    flex-direction: column;
  }
  
  :deep(.action-button) {
    width: 100%;
    justify-content: center;
  }
}

.product-details-modal p:last-child {
  margin-bottom: 0;
}
</style>
