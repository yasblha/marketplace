<template>
    <section>
        <div class="titles">
            <h1>Favorites</h1>
        </div>
        <div class="buttonShopAll">
            <button>Shop All</button>
        </div>
        <div class="lesproduits">
            <div v-for="product in favoriteProducts" :key="product.id" class="produit">
                <img class="productImage" :src="getImage(product)" alt="">
                <div class="productinfos">
                    <span>{{ product.name }}</span>
                    <button class="remove" @click="removeFromFavorites(product.id)">Remove</button>
                    <!-- Bouton pour supprimer des favoris -->
                </div>
                <div class="price">
                    <span>{{ product.price }}</span>
                </div>
            </div>
        </div>
    </section>
    <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/user';
import { useFavoriteStore } from '@/stores/Favorites';
import defaultImage from '@/assets/ui_assets/image1.png';
import Footer from '../components/UI/Footer.vue';
import type { Product } from '@/stores/products';

// Déclarations et initialisations
const authStore = useAuthStore();
const favoriteStore = useFavoriteStore();
const favoriteProducts = ref < Product[] > ([]);

// Fonction pour obtenir l'image d'un produit
const getImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
        const baseUrl = 'http://localhost:3000';
        return `${baseUrl}/${product.images[0]}`;
    }
    return defaultImage;
};

// Fonction pour récupérer les favoris
const fetchFavorites = async () => {
    try {
        if (authStore.user?.id) {
            await favoriteStore.fetchFavorites(authStore.user.id);
            favoriteProducts.value = favoriteStore.favoriteProducts;
        }
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }
};

// Fonction pour supprimer un produit des favoris
const removeFromFavorites = async (productId: string) => {
    try {
        if (!authStore.isAuthenticated || !authStore.user) {
            throw new Error('User is not authenticated or user details are missing');
        }
        await favoriteStore.removeFromFavorite(authStore.user.id, productId);
        await fetchFavorites(); // Re-fetch favorites after removal
    } catch (error) {
        console.error('Error removing from favorites:', error);
    }
};

// Initialisation lors du montage du composant
onMounted(() => {
    fetchFavorites();
});
</script>

<style scoped>
section {
    padding: 18px;
}

div.titles {
    text-align: center;
}

div.buttonShopAll {
    text-align: center;
    margin: 23px;
}

div.buttonShopAll button {
    border: 1px solid black;
    padding: 9px;
    width: 10%;
    background: whitesmoke;
}

div.lesproduits {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

div.produit {
    width: 20%;
    margin-left: 4px;
    padding: 17px;
}

.productImage {
    width: -webkit-fill-available;
    margin: auto;
    height: auto;
}

div.productinfos {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.remove{
    background: none;
    border: none;
    color: red;
    text-decoration: underline;
    cursor:pointer;
}
.removeFavoriteButton {
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.removeFavoriteButton:hover {
    background-color: #c62828;
}

div.price span {}
</style>