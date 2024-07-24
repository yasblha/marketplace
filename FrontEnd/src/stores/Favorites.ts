import { defineStore } from 'pinia';
import axiosInstance from "@/services/api";
import { ref } from 'vue';

export const useFavoriteStore = defineStore('favorite', () => {
    const favoriteProducts = ref([]);

    const addToFavorite = async (userId: number | undefined, productId: number) => {
        if (!userId) {
            throw new Error('User ID is not available');
        }

        try {
            await axiosInstance.post('/favorites/add', { userId, productId });
            await fetchFavorites(userId);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const fetchFavorites = async (userId: number | undefined) => {
        if (!userId) {
            throw new Error('User ID is not available');
        }

        try {
            const response = await axiosInstance.get(`/favorites/${userId}`);
            favoriteProducts.value = response.data;
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const removeFromFavorite = async (userId: number, productId: number) => {
        try {
            await axiosInstance.post('/favorites/remove', { userId, productId });
            await fetchFavorites(userId);
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    return {
        addToFavorite,
        fetchFavorites,
        removeFromFavorite,
        favoriteProducts
    };
});
