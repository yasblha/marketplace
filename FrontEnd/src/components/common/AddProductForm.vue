<template>
  <form @submit.prevent="handleSubmit">
    <div v-for="field in formFields" :key="field.name">
      <label :for="field.name">{{ field.label }}</label>
      <input
          v-if="field.type === 'text'"
          :id="field.name"
          v-model="productData[field.name]"
          :type="field.type"
      />
      <textarea
          v-else-if="field.type === 'textarea'"
          :id="field.name"
          v-model="productData[field.name]"
      ></textarea>
      <select
          v-else-if="field.type === 'select'"
          :id="field.name"
          v-model="productData[field.name]"
      >
        <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
      </select>
      <input
          v-else-if="field.type === 'number'"
          :id="field.name"
          v-model="productData[field.name]"
          :type="field.type"
          @input="validateNumberInput(field.name)"
      />
      <span v-if="errors[field.name]">{{ errors[field.name] }}</span>
    </div>
    <div>
      <label for="images">Images</label>
      <input type="file" id="images" multiple @change="handleFileChange" />
      <div class="image-previews">
        <div v-for="(image, index) in images" :key="index" class="image-preview">
          <img :src="image.url" :alt="`Image ${index + 1}`" />
          <button @click.prevent="removeImage(index)">X</button>
        </div>
      </div>
    </div>
    <button type="submit" :disabled="isSubmitting">Submit</button>
    <div v-if="serverError">{{ serverError }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { z } from 'zod';
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
});

const isEditing = computed(() => !!props.initialData?._id);

watch(() => props.initialData, (newValue) => {
  if (newValue) {
    Object.assign(productData.value, newValue);
  }
}, { immediate: true });

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);
const serverError = ref<string | null>(null);

const images = ref<{ file: File; url: string }[]>([]);

const validationSchema = z.object({
  name: z.string().nonempty('Product Name is required'),
  description: z.string().nonempty('Description is required'),
  category: z.string().nonempty('Category is required'),
  brand: z.string().nonempty('Brand is required'),
  price: z.number().positive('Price must be a positive number'),
  stock_available: z.number().nonnegative('Stock Available must be a non-negative number'),
  status: z.enum(['available', 'out_of_stock', 'discontinued']),
});

const validate = () => {
  try {
    validationSchema.parse(productData.value);
    errors.value = {};
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.errors.reduce((acc, err) => {
        acc[err.path[0] as string] = err.message;
        return acc;
      }, {} as Record<string, string>);
    }
    return false;
  }
};

const validateNumberInput = (fieldName: keyof ProductData) => {
  const value = productData.value[fieldName];
  if (typeof value === 'number' && value < 0) {
    productData.value[fieldName] = 0 as never;
  }
};

const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    for (const file of files) {
      const url = URL.createObjectURL(file);
      images.value.push({ file, url });
    }
  }
};

const removeImage = (index: number) => {
  images.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (isSubmitting.value) {
    console.log('Submission is already in progress');
    return; // Prevent multiple submissions
  }

  if (validate()) {
    isSubmitting.value = true;
    serverError.value = null;
    console.log('Submitting the form', productData.value);

    try {
      const formData = new FormData();
      Object.entries(productData.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      images.value.forEach((image) => {
        formData.append('images', image.file); // Ajout des fichiers sous le champ 'images'
      });

      console.log('FormData:', Array.from(formData.entries()));

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
        };
        images.value = [];
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      serverError.value = 'An error occurred while submitting the form.';
    } finally {
      isSubmitting.value = false;
      console.log('Submission finished');
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: black;
}

label {
  font-weight: bold;
  color: black;
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

.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.image-preview {
  position: relative;
}

.image-preview img {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
}

.image-preview button {
  position: absolute;
  top: 0;
  right: 0;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}
</style>
