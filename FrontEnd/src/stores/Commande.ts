import { defineStore } from 'pinia';
import axiosInstance from "@/services/api";
import { ref, computed } from 'vue';

export interface Order {
    id: number;
    date_order: Date;
    status_order: string;
    total_amount: number;
    product_ids: number[];
    userId: number;
}

interface OrderCreateData {
    userId: number;
    status_order: string;
    total_amount: number;
    product_ids: number[];
}

interface OrderUpdateData {
    status_order?: string;
    total_amount?: number;
    product_ids?: number[];
}

export const useOrderStore = defineStore('order', () => {
    const orders = ref<Order[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchOrders = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get('/orders');
            orders.value = response.data;
        } catch (err) {
            error.value = 'Failed to fetch orders';
        } finally {
            isLoading.value = false;
        }
    };

    const fetchOrderById = async (orderId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get(`/orders/${orderId}`);
            return response.data;
        } catch (err) {
            error.value = `Failed to fetch order with id ${orderId}`;
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    const createOrder = async (orderData: OrderCreateData) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.post('/orders', orderData);
            orders.value.push(response.data);
        } catch (err) {
            error.value = 'Failed to create order';
        } finally {
            isLoading.value = false;
        }
    };

    const updateOrder = async (orderId: number, updates: OrderUpdateData) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.put(`/orders/${orderId}`, updates);
            const index = orders.value.findIndex(order => order.id === orderId);
            if (index !== -1) {
                orders.value[index] = response.data;
            }
        } catch (err) {
            error.value = `Failed to update order with id ${orderId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteOrder = async (orderId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            await axiosInstance.delete(`/orders/${orderId}`);
            orders.value = orders.value.filter(order => order.id !== orderId);
        } catch (err) {
            error.value = `Failed to delete order with id ${orderId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const addProductToOrder = async (orderId: number, productId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.post(`/orders/${orderId}/products/${productId}`);
            const index = orders.value.findIndex(order => order.id === orderId);
            if (index !== -1) {
                orders.value[index] = response.data;
            }
        } catch (err) {
            error.value = `Failed to add product to order with id ${orderId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const removeProductFromOrder = async (orderId: number, productId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.delete(`/orders/${orderId}/products/${productId}`);
            const index = orders.value.findIndex(order => order.id === orderId);
            if (index !== -1) {
                orders.value[index] = response.data;
            }
        } catch (err) {
            error.value = `Failed to remove product from order with id ${orderId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const getProductsFromOrder = async (orderId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get(`/orders/${orderId}/products`);
            return response.data;
        } catch (err) {
            error.value = `Failed to get products from order with id ${orderId}`;
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        orders,
        isLoading,
        error,
        fetchOrders,
        fetchOrderById,
        createOrder,
        updateOrder,
        deleteOrder,
        addProductToOrder,
        removeProductFromOrder,
        getProductsFromOrder,
    };
});
