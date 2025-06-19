<template>
  <form @submit.prevent="handleSubmit" class="max-w-4xl mx-auto my-8 p-8 bg-white rounded-lg shadow-sm border border-gray-100">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">
        {{ isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit' }}
      </h2>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Remplissez les détails du produit ci-dessous
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div v-for="field in formFields" :key="field.name" :class="{ 'md:col-span-2': field.fullWidth }">
        <div class="space-y-2">
          <label :for="field.name" class="block text-sm font-medium text-gray-700">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>
          
          <!-- Input Text/Number -->
          <template v-if="field.type === 'text' || field.type === 'number'">
            <input
              :id="field.name"
              v-model="productData[field.name]"
              :type="field.type"
              :placeholder="field.placeholder"
              :step="field.step"
              :min="field.min"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
              :class="{ 'border-red-300': errors[field.name], 'border-gray-200': !errors[field.name] }"
              @input="field.type === 'number' ? validateNumberInput(field.name) : null"
            >
          </template>
          
          <!-- Textarea -->
          <template v-else-if="field.type === 'textarea'">
            <textarea
              :id="field.name"
              v-model="productData[field.name]"
              :placeholder="field.placeholder"
              rows="4"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
              :class="{ 'border-red-300': errors[field.name], 'border-gray-200': !errors[field.name] }"
            ></textarea>
          </template>
          
          <!-- Select -->
          <template v-else-if="field.type === 'select'">
            <div class="relative">
              <select
                :id="field.name"
                v-model="productData[field.name]"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors appearance-none bg-white pr-10"
                :class="{ 'border-red-300': errors[field.name], 'border-gray-200': !errors[field.name] }"
              >
                <option value="" disabled selected>{{ field.placeholder || 'Sélectionnez une option' }}</option>
                <option v-for="option in field.options" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </template>
          
          <!-- Error Message -->
          <p v-if="errors[field.name]" class="mt-1 text-sm text-red-500">
            {{ errors[field.name] }}
          </p>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <label class="flex flex-col items-center justify-center w-full p-12 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          multiple
          accept="image/*"
          @change="handleFileChange"
        >
        <div class="flex flex-col items-center justify-center text-center">
          <div class="w-14 h-14 flex items-center justify-center bg-blue-50 text-blue-500 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h4 class="text-lg font-medium text-gray-900 mb-1">Glissez-déposez vos images ici</h4>
          <p class="text-sm text-gray-500">ou cliquez pour sélectionner des fichiers</p>
        </div>
      </label>
      
      <div v-if="images.length > 0" class="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="(image, index) in images" :key="index" class="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
          <img :src="image.preview" :alt="'Preview ' + (index + 1)" class="w-full h-full object-cover" />
          <button 
            type="button" 
            @click="removeImage(index)"
            class="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white/90 text-red-500 rounded-full hover:bg-red-50 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="serverError" class="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ serverError }}</span>
      </div>
    </div>

    <div class="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
      <button 
        type="button" 
        class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        @click="$emit('cancel')"
        :disabled="isSubmitting"
      >
        Annuler
      </button>
      <button 
        type="submit" 
        class="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
        :disabled="isSubmitting"
        :class="{ 'opacity-70 cursor-not-allowed': isSubmitting }"
      >
        <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isEditing ? 'Mettre à jour' : 'Ajouter le produit' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="serverError" class="server-error">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 14L12 12M12 12L14 10M12 12L10 10M12 12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ serverError }}
      </div>
    </transition>
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
  images?: File[];
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
  { 
    name: 'name', 
    label: 'Nom du produit', 
    type: 'text',
    placeholder: 'Ex: T-shirt en coton bio',
    fullWidth: true,
    required: true
  },
  { 
    name: 'description',
    label: 'Description détaillée',
    type: 'textarea',
    placeholder: 'Décrivez votre produit en détail...',
    fullWidth: true,
    required: true
  },
  {
    name: 'category',
    label: 'Catégorie',
    type: 'select',
    options: ['Vêtements', 'Électronique', 'Maison', 'Autre'],
    required: true
  },
  {
    name: 'brand',
    label: 'Marque',
    type: 'text',
    placeholder: 'Ex: Nike, Apple, IKEA',
    required: true
  },
  {
    name: 'price',
    label: 'Prix (€)',
    type: 'number',
    step: '0.01',
    min: '0',
    required: true
  },
  {
    name: 'stock_available',
    label: 'Quantité disponible',
    type: 'number',
    min: '0',
    required: true
  },
  {
    name: 'status',
    label: 'Statut',
    type: 'select',
    options: ['available', 'unavailable', 'draft'],
    required: true
  }
];

const productData = ref<ProductData>({
  name: '',
  description: '',
  category: '',
  brand: '',
  price: 0,
  stock_available: 0,
  status: 'available',
  images: []
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

const images = ref<{ file: File; preview: string }[]>([]);

const validationSchema = z.object({
  name: z.string().min(1, 'Le nom du produit est requis'),
  description: z.string().min(1, 'La description est requise'),
  category: z.string().min(1, 'La catégorie est requise'),
  brand: z.string().min(1, 'La marque est requise'),
  price: z.number().min(0, 'Le prix doit être un nombre positif'),
  stock_available: z.number().int().min(0, 'La quantité disponible doit être un nombre entier positif'),
  status: z.enum(['available', 'unavailable', 'draft']),
  images: z.array(z.any()).optional()
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
      const preview = URL.createObjectURL(file);
      images.value.push({ file, preview });
    }
  }
};

const removeImage = (index: number) => {
  images.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  serverError.value = '';

  try {
    // Validation
    if (!validate()) {
      isSubmitting.value = false;
      return;
    }

    // Création du FormData
    const formData = new FormData();
    
    // Ajout des champs du formulaire
    Object.entries(productData.value).forEach(([key, value]) => {
      if (key === 'images') return;
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Ajout des images
    images.value.forEach((image) => {
      formData.append('images', image.file);
    });

    // Envoi des données
    if (isEditing.value && productData.value._id) {
      await productStore.updateProduct(productData.value._id, formData);
      emit('product-updated');
      emit('success', 'Produit mis à jour avec succès');
    } else {
      await productStore.createProduct(formData);
      emit('product-added');
      emit('success', 'Produit créé avec succès');
    }
    
    // Réinitialiser le formulaire si création
    if (!isEditing.value) {
      productData.value = {
        name: '',
        description: '',
        category: '',
        brand: '',
        price: 0,
        stock_available: 0,
        status: 'available'
      };
      images.value = [];
    }
    
    emit('saved');
  } catch (error: any) {
    console.error('Erreur lors de la sauvegarde du produit :', error);
    serverError.value = error.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde du produit';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<!-- Tous les styles sont gérés par Tailwind CSS -->
