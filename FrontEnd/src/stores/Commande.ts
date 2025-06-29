import { defineStore } from 'pinia';
import axiosInstance from "@/services/api";
import { ref } from 'vue';
import { useAuthStore } from "@/stores/user";
import { OrderStatus } from '@/types/orderStatus';

export interface Order {
    id: number;
    dateOrder: Date;
    statusOrder: OrderStatus;
    totalAmount: number;
    userId: number | null;
    OrderDetails: OrderDetail[];
}

export interface OrderDetail {
    productId: string;
    productName: string;
    productDescription: string;
    productCategory: string;
    productBrand: string;
    unitPrice: number;
    quantity: number;
}

interface OrderCreateData {
    userId: number | null;
    statusOrder: OrderStatus;
    totalAmount: number;
    products: { productId: string; quantity: number }[];
}

interface OrderUpdateData {
    statusOrder?: OrderStatus;
    totalAmount?: number;
    products?: { productId: string; quantity: number }[];
}

export const useOrderStore = defineStore('order', () => {
    const orders = ref<Order[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const authStore = useAuthStore();

    const fetchOrders = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get('/orders');
            orders.value = response.data;
        } catch (err) {
            error.value = 'Échec de la récupération des commandes';
        } finally {
            isLoading.value = false;
        }
    };
    const getOrderByUserId = async (userId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get(`/orders/user/${userId}`);
            orders.value = response.data;
            return response.data;
        } catch (err) {
            error.value = `Échec de la récupération des commandes de l'utilisateur avec l'ID ${userId}`;
            return null;
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
            error.value = `Échec de la récupération de la commande avec l'ID ${orderId}`;
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    const createOrder = async (orderData: Omit<OrderCreateData, 'userId'>) => {
        if (isLoading.value) return null;

        isLoading.value = true;
        error.value = null;
        try {
            if (!authStore.user?.id) throw new Error('User not authenticated');

            const data: OrderCreateData = {
                ...orderData,
                userId: authStore.user.id,
            };

            const response = await axiosInstance.post('/orders/', data);

            // Backend can return {success:true,data:{orderId}} or {orderId}
            const orderId = response.data?.data?.orderId ?? response.data?.orderId ?? response.data?.id;
            if (!orderId) throw new Error('Invalid response from server');

            const newOrder: Order = {
                id: orderId,
                dateOrder: new Date(),
                statusOrder: data.statusOrder,
                totalAmount: data.totalAmount,
                userId: data.userId,
                OrderDetails: data.products.map(p => ({
                    productId: p.productId,
                    productName: '',
                    productDescription: '',
                    productCategory: '',
                    productBrand: '',
                    unitPrice: 0,
                    quantity: p.quantity
                }))
            };
            orders.value.push(newOrder);
            return orderId;
        } catch (err: any) {
            console.error('Error creating order:', err);
            error.value = err.response?.data?.message || err.message || 'Failed to create order';
            return null;
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
            return response.data;
        } catch (err) {
            error.value = `Échec de la mise à jour de la commande avec l'ID ${orderId}`;
            return null;
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
            error.value = `Échec de la suppression de la commande avec l'ID ${orderId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const addProductToOrder = async (orderId: number, productId: string, quantity: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.post(`/orders/${orderId}/products/${productId}`, { quantity });
            const index = orders.value.findIndex(order => order.id === orderId);
            if (index !== -1) {
                orders.value[index] = response.data;
            }
        } catch (err) {
            error.value = `Échec de l'ajout du produit à la commande avec l'ID ${orderId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const removeProductFromOrder = async (orderId: number, productId: string) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.delete(`/orders/${orderId}/products/${productId}`);
            const index = orders.value.findIndex(order => order.id === orderId);
            if (index !== -1) {
                orders.value[index] = response.data;
            }
        } catch (err) {
            error.value = `Échec de la suppression du produit de la commande avec l'ID ${orderId}`;
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
            error.value = `Échec de la récupération des produits de la commande avec l'ID ${orderId}`;
            return null;
        } finally {
            isLoading.value = false;
        }
    };


    return {
        getOrderByUserId,
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
