import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axiosInstance from "@/services/api";

interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    stock_available: number;
    status: string;
    image: string;
}

export const useProductStore = defineStore('product', () => {
    const products = ref<Product[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchAllProducts() {
        loading.value = true;
        try {
            const response = await axiosInstance.get('/products/all');
            console.log('Fetch all products response:', response.data);
            if (Array.isArray(response.data)) {
                products.value = response.data;
            } else if (response.data.products) {
                products.value = response.data.products;
            } else {
                throw new Error('Unexpected data format');
            }
        } catch (err: any) {
            handleError(err);
        } finally {
            loading.value = false;
        }
    }


    async function createProduct(productData: FormData) {
        loading.value = true;
        try {
            const response = await axiosInstance.post('/products/create', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            products.value.push(response.data.product);
        } catch (err: any) {
            handleError(err);
        } finally {
            loading.value = false;
        }
    }

    async function updateProduct(id: string, productData: Partial<Product> | FormData) {
        loading.value = true;
        try {
            let response;
            if (productData instanceof FormData) {
                response = await axiosInstance.put(`/products/${id}`, productData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await axiosInstance.put(`/products/${id}`, productData);
            }
            const updatedProduct = response.data.product;
            const index = products.value.findIndex(p => p._id === updatedProduct._id);
            if (index !== -1) {
                products.value[index] = updatedProduct;
            }
        } catch (err: any) {
            handleError(err);
        } finally {
            loading.value = false;
        }
    }

    async function deleteProduct(id: string) {
        loading.value = true;
        try {
            await axiosInstance.delete(`/products/${id}`);
            products.value = products.value.filter(p => p._id !== id);
        } catch (err: any) {
            handleError(err);
        } finally {
            loading.value = false;
        }
    }

    async function handleError(err: any) {
        if (err.response) {
            error.value = err.response.data.error || "An error occurred.";
        } else if (err.request) {
            error.value = "No response received from the server.";
        } else {
            error.value = err.message;
        }
    }

    return {
        products,
        loading,
        error,
        fetchAllProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    };
});
