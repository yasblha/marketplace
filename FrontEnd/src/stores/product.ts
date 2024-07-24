import { ref } from 'vue';
import { defineStore } from 'pinia';
import axiosInstance from "@/services/api";

interface Product {
    Id: string;
    name: string;
    description: string;
    category: string; 
    brand: string;
    price: number;
    stock_available: number;
    status: string;
    image: string[];
}

export const useProductStore = defineStore('product', () => {
    const products = ref<Product[]>([]);
    debugger;
    const fetchProducts = async (): Promise<void> => {
        const response = await axiosInstance.get('/products/get');
        products.value = response.data.mongoProducts;
        console.log(response.data);
        console.log(products.value);
    };

    const getProductById = async (id: string): Promise<Product> => {
        const response = await axiosInstance.get<Product>(`/products/${id}`);
        return response.data;
    };

    const createProduct = async (productData: FormData): Promise<void> => {
        const response = await axiosInstance.post<Product>('/products', productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        products.value.push(response.data);
    };

    const updateProduct = async (id: string, productData: FormData): Promise<void> => {
        const response = await axiosInstance.put<Product>(`/products/${id}`, productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        const index = products.value.findIndex(p => p.Id === id);
        if (index !== -1) {
            products.value[index] = response.data;
        }
    };

    const deleteProduct = async (id: string): Promise<void> => {
        await axiosInstance.delete(`/products/${id}`);
        products.value = products.value.filter(p => p.Id !== id);
    };

    const updateProductStock = async (id: string, stockData: { stock_available: number }): Promise<void> => {
        const response = await axiosInstance.patch<Product>(`/products/${id}/stock`, stockData);
        const index = products.value.findIndex(p => p.Id === id);
        if (index !== -1) {
            products.value[index] = { ...products.value[index], ...response.data };
        }
    };

    const searchProducts = async (query: string): Promise<void> => {
        const response = await axiosInstance.get<Product[]>(`/products/search`, { params: { q: query } });
        products.value = response.data;
    };

    return {
        products,
        fetchProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        searchProducts,
    };
});