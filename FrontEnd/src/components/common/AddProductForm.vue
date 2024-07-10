<template>
  <form @submit.prevent="submitForm">
    <div v-for="field in formFields" :key="field.name">
      <label :for="field.name">{{ field.label }}:</label>
      <input v-if="field.type !== 'select' && field.type !== 'file' && field.type !== 'textarea'"
             :type="field.type"
             :id="field.name"
             v-model="productData[field.name as keyof ProductData]"
             required
      />
      <textarea v-if="field.type === 'textarea'"
                :id="field.name"
                v-model="productData[field.name as keyof ProductData]"
                required
      ></textarea>
      <select v-else-if="field.type === 'select'"
              :id="field.name"
              v-model="productData[field.name as keyof ProductData]"
              required
      >
        <option v-for="option in field.options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <div>
      <label for="images">Images:</label>
      <input
          type="file"
          id="images"
          @change="handleFileUpload"
          accept="image/*"
          multiple
      />
      <div v-if="imagePreviews.length > 0">
        <p>Selected images:</p>
        <ul>
          <li v-for="(image, index) in imagePreviews" :key="index">
            <img :src="image" alt="Preview" style="max-width: 100px; max-height: 100px;" />
            <button type="button" @click="removeImage(index)">Remove</button>
          </li>
        </ul>
      </div>
    </div>

    <button type="submit">{{ isEditing ? 'Update' : 'Add' }} Product</button>
  </form>
</template>


<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useProductStore } from '@/stores/products';

interface ProductData {
  _id?: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock_available: number;
  status: string;
  images: string[]; // store image paths
}

interface FormField {
  name: keyof ProductData;
  type: string;
  label: string;
  options?: string[];
}

const props = defineProps<{
  initialData?: Partial<ProductData>
}>();

const emit = defineEmits<{
  (e: 'product-added'): void;
  (e: 'product-updated'): void;
}>();

const productStore = useProductStore();

const formFields: FormField[] = [
  { name: 'name', type: 'text', label: 'Product Name' },
  { name: 'description', type: 'textarea', label: 'Description' },
  { name: 'category', type: 'text', label: 'Category' },
  { name: 'brand', type: 'text', label: 'Brand' },
  { name: 'price', type: 'number', label: 'Price' },
  { name: 'stock_available', type: 'number', label: 'Stock Available' },
  { name: 'status', type: 'select', label: 'Status', options: ['available', 'out_of_stock', 'discontinued'] },
];

const productData = ref<ProductData>({
  name: '',
  description: '',
  category: '',
  brand: '',
  price: 0,
  stock_available: 0,
  status: 'available',
  images: [],
});

const imagePreviews = ref<string[]>([]);

const isEditing = computed(() => !!props.initialData?._id);

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    productData.value = {
      name: newVal.name || '',
      description: newVal.description || '',
      category: newVal.category || '',
      brand: newVal.brand || '',
      price: newVal.price || 0,
      stock_available: newVal.stock_available || 0,
      status: newVal.status || 'available',
      images: newVal.images || [],
      _id: newVal._id,
    };
    imagePreviews.value = newVal.images || [];
  }
}, { deep: true });

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      productData.value.images.push(data.path);
      imagePreviews.value.push(URL.createObjectURL(file));
    }
  }
};

const removeImage = (index: number) => {
  productData.value.images.splice(index, 1);
  imagePreviews.value.splice(index, 1);
};

const submitForm = async () => {
  try {
    const formData = new FormData();
    Object.entries(productData.value).forEach(([key, value]) => {
      if (key !== '_id' && key !== 'images' && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (isEditing.value && productData.value._id) {
      await productStore.updateProduct(productData.value._id, formData);
      emit('product-updated');
    } else {
      await productStore.createProduct(formData);
      emit('product-added');
    }

    if (!isEditing.value) {
      productData.value = {
        name: '',
        description: '',
        category: '',
        brand: '',
        price: 0,
        stock_available: 0,
        status: 'available',
        images: []
      };
      imagePreviews.value = [];
    }
  } catch (err) {
    console.error('Error submitting form:', err);
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
  color: black;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}
</style>

