<template>
    <NavigationBar />
    <section>
        <div class="titles">
            <h1>Favorites</h1>
        </div>
        <div class="buttonShopAll">
            <button>Shop All</button>
        </div>
        <div class="lesproduits">
            <div v-for="(product, index) in favoriteProducts" :key="index" class="produit">
                <img class="productImage" :src="product.images[0]" alt="Product Image" />
                <div class="productinfos">
                    <span>{{ product.name }}</span>
                    <FavoritesIcon :isInitiallyFavorited="product.isFavorited"
                        @update:isFavorited="(isFavorited) => updateFavorite(product._id, isFavorited)" />
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
import { ref, computed } from 'vue';
import NavigationBar from "@/components/UI/NavigationBar.vue";
import Footer from "@/components/UI/Footer.vue";
import FavoritesIcon from '@/components/UI/Buttons/FavoritesIcon.vue';
import type { Product } from '@/products_simulate/product_data';
import { products as simulatedProducts } from '@/products_simulate/product_data';

// Declare fetchedProducts as a reactive reference
const fetchedProducts = ref<Product[]>(simulatedProducts);

const favoriteProducts = computed(() => {
    return fetchedProducts.value.filter(product => product.isFavorited);
});

const updateFavorite = (productId: string, isFavorited: boolean) => {
    const product = fetchedProducts.value.find(p => p._id === productId);
    if (product) {
        product.isFavorited = isFavorited;
    }
};
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
    width: 220px;
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
    justify-content: space-between;
}

svg{
    
}

div.productinfos span {}

div.price {}

div.price span {}
</style>
