<template>
  <div>
    <h2>Add New Product</h2>
    <form @submit.prevent="addProduct">
      <div v-for="field in formFields" :key="field.name">
        <label :for="field.name">{{ field.label }}:</label>
        <input v-if="field.type !== 'select' && field.type !== 'file'"
               :type="field.type"
               :id="field.name"
               v-model="productData[field.name]"
               required
        />
        <select v-else-if="field.type === 'select'"
                :id="field.name"
                v-model="productData[field.name]"
                required
        >
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <input v-else
               type="file"
               :id="field.name"
               @change="handleFileUpload"
               accept="image/*"
        />
      </div>
      <button type="submit" :disabled="loading">Add Product</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useProductStore } from '@/stores/products';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock_available: number;
  status: string;
  image?: string | File;
}

interface FormField {
  name: keyof Product;
  type: string;
  label: string;
  value: any;
  options?: string[];
}

const productStore = useProductStore();

const formFields: FormField[] = [
  { name: 'name', type: 'text', label: 'Product Name', value: '' },
  { name: 'description', type: 'textarea', label: 'Description', value: '' },
  { name: 'category', type: 'text', label: 'Category', value: '' },
  { name: 'brand', type: 'text', label: 'Brand', value: '' },
  { name: 'price', type: 'number', label: 'Price', value: 0 },
  { name: 'stock_available', type: 'number', label: 'Stock Available', value: 0 },
  { name: 'status', type: 'select', label: 'Status', value: 'available', options: ['available', 'out_of_stock', 'discontinued'] },
  { name: 'image', type: 'file', label: 'Image', value: null },
];

const productData = ref<Partial<Product>>(formFields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {}));

const error = ref('');
const loading = ref(false);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    productData.value.image = target.files[0];
  }
};

const addProduct = async () => {
  loading.value = true;
  error.value = '';

  const formData = new FormData();
  Object.entries(productData.value).forEach(([key, value]) => {
    if (key === 'image' && value instanceof File) {
      formData.append('image', value);
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  try {
    await productStore.createProduct(formData);
    // Reset form after successful addition
    productData.value = formFields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {});
  } catch (err) {
    error.value = 'An error occurred while adding the product.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: bold;
}

input, select, textarea {
  width: 100%;
  padding: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
}

.error {
  color: red;
}
</style>