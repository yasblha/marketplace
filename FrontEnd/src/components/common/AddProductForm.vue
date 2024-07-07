<template>
  <form @submit.prevent="submitForm">
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
    <button type="submit">{{ isEditing ? 'Update' : 'Add' }} Product</button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useProductStore } from '@/stores/products';

const props = defineProps<{
  initialData?: any
}>();

const emit = defineEmits(['product-added', 'product-updated']);

const productStore = useProductStore();

const formFields = [
  { name: 'name', type: 'text', label: 'Product Name', value: '' },
  { name: 'description', type: 'textarea', label: 'Description', value: '' },
  { name: 'category', type: 'text', label: 'Category', value: '' },
  { name: 'brand', type: 'text', label: 'Brand', value: '' },
  { name: 'price', type: 'number', label: 'Price', value: 0 },
  { name: 'stock_available', type: 'number', label: 'Stock Available', value: 0 },
  { name: 'status', type: 'select', label: 'Status', value: 'available', options: ['available', 'out_of_stock', 'discontinued'] },
  { name: 'image', type: 'file', label: 'Image', value: null },
];

const productData = ref(props.initialData || {});

const isEditing = computed(() => !!props.initialData?._id);

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    productData.value = { ...newVal };
  }
}, { deep: true });

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    productData.value.image = target.files[0];
  }
};

const submitForm = async () => {
  const formData = new FormData();
  Object.entries(productData.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false');
      } else if (typeof value === 'number') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, String(value));
      }
    }
  });

  try {
    if (isEditing.value && productData.value._id) {
      await productStore.updateProduct(productData.value._id, formData);
      emit('product-updated');
    } else {
      await productStore.createProduct(formData);
      emit('product-added');
    }
    if (!isEditing.value) {
      productData.value = formFields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {});
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
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
</style>