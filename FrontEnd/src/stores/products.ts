import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/user';
import axiosInstance from "@/services/api";

export interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    stock_available: number;
    status: string;
    images: string[];
}

export interface SearchCriteria {
    name?: string;
    description?: string;
    category?: string;
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    onSale?: boolean;
    inStock?: boolean;
}

export const useProductStore = defineStore('product', () => {
    const products = ref<Product[]>([]);
    const authStore = useAuthStore();  // Initialize authStore correctly

    const fetchProducts = async (): Promise<void> => {
        try {
            const response = await axiosInstance.get('/products');
            products.value = response.data.mongoProducts;
            console.log('Fetched products:', products.value);
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products');
        }
    };

    const getProductById = async (id: string): Promise<Product> => {
        try {
            const response = await axiosInstance.get<Product>(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            throw new Error('Failed to fetch product by ID');
        }
    };

    const createProduct = async (productData: FormData): Promise<void> => {
        try {
            if (!authStore.token) {
                throw new Error('Token non disponible');
            }
            console.log('Creating product with user data:', authStore.user);
            const response = await axiosInstance.post<Product>('/products', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            products.value.push(response.data);
            console.log('Product created:', response.data);
        } catch (error) {
            console.error('Error creating product:', error);
            throw new Error('Failed to create product');
        }
    };

    const uploadProductImages = async (formData: FormData): Promise<void> => {
        try {
            await axiosInstance.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            console.log('Images uploaded successfully');
        } catch (error) {
            console.error('Error uploading images:', error);
            throw new Error('Failed to upload images');
        }
    };

    const updateProduct = async (id: string, productData: FormData): Promise<void> => {
        try {
            const response = await axiosInstance.put<Product>(`/products/${id}`, productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            const index = products.value.findIndex(p => p._id === id);
            if (index !== -1) {
                products.value[index] = response.data;
            }
            console.log('Product updated:', response.data);
        } catch (error) {
            console.error('Error updating product:', error);
            throw new Error('Failed to update product');
        }
    };

    const deleteProduct = async (id: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            products.value = products.value.filter(p => p._id !== id);
            console.log(`Product with ID ${id} deleted`);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw new Error('Failed to delete product');
        }
    };

    const updateProductStock = async (id: string, stockData: { stock_available: number }): Promise<void> => {
        try {
            const response = await axiosInstance.patch<Product>(`/products/${id}/stock`, stockData, {
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            const index = products.value.findIndex(p => p._id === id);
            if (index !== -1) {
                products.value[index] = { ...products.value[index], ...response.data };
            }
            console.log('Product stock updated:', response.data);
        } catch (error) {
            console.error('Error updating product stock:', error);
            throw new Error('Failed to update product stock');
        }
    };

    const searchProducts = async (query: string): Promise<void> => {
        try {
            const response = await axiosInstance.get<Product[]>('/products/search', {
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                },
                params: { q: query }
            });
            products.value = response.data;
            console.log('Products found:', products.value);
        } catch (error) {
            console.error('Error searching products:', error);
            throw new Error('Failed to search products');
        }
    };

    const injectProducts = async () => {
        try {
            const response = await axiosInstance.post('/products/inject-products');
            console.log(response.data.message);
        } catch (error) {
            console.error('Error injecting products:', error);
        }
    };

    const searchFacetedProducts = async (criteria: SearchCriteria): Promise<void> => {
        try {
            const params: Record<string, any> = {};
            if (criteria.name) params.name = criteria.name;
            if (criteria.description) params.description = criteria.description;
            if (criteria.category) params.category = criteria.category;
            if (criteria.brand) params.brand = criteria.brand;
            if (criteria.priceMin !== undefined) params.priceMin = criteria.priceMin;
            if (criteria.priceMax !== undefined) params.priceMax = criteria.priceMax;
            if (criteria.onSale !== undefined) params.onSale = criteria.onSale;
            if (criteria.inStock !== undefined) params.inStock = criteria.inStock;

            const response = await axiosInstance.get<Product[]>('/products/faceted-search', {
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                },
                params
            });
            products.value = response.data;
            console.log('Faceted search results:', products.value);
        } catch (error) {
            console.error('Error performing faceted search:', error);
            throw new Error('Failed to perform faceted search');
        }
    };

    return {
        products,
        fetchProducts,
        getProductById,
        createProduct,
        uploadProductImages,
        updateProduct,
        deleteProduct,
        updateProductStock,
        searchProducts,
        injectProducts,
        searchFacetedProducts
    };
});
