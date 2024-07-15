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
                <div class="productWrapper" @mouseover="hoverProduct(index)" @mouseleave="leaveProduct()">
                    <router-link :to="'/product/' + product._id">
                        <img class="productImage" :src="product.images[0]" :alt="product.name" />
                    </router-link>
                    <div class="productHover" v-if="hoveredIndex === index">
                        <router-link :to="'/product/' + product._id">
                            <div class="paiementNf">
                                <PaiementNow />
                            </div>
                        </router-link>
                    </div>
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
        </div>
    </section>
    <Footer />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import NavigationBar from "@/components/UI/NavigationBar.vue";
import Footer from "@/components/UI/Footer.vue";
import FavoritesIcon from '@/components/UI/Buttons/FavoritesIcon.vue';
import PaiementNow from '@/components/UI/Buttons/PaiementNow.vue';// Assurez-vous que le chemin est correct
import type { Product } from '@/products_simulate/product_data';
import { products as simulatedProducts } from '@/products_simulate/product_data';

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

// State for tracking which product is being hovered
const hoveredIndex = ref<number | null>(null);

const hoverProduct = (index: number) => {
    hoveredIndex.value = index;
};

const leaveProduct = () => {
    hoveredIndex.value = null;
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

.productWrapper {
    position: relative;
    width: 220px;
    margin-left: 4px;
    padding: 17px;
}

.productImage {
    width: 100%;
    height: auto;
    transition: opacity 0.3s ease;
}

.productWrapper:hover .productImage {
    opacity: 0.7;
}

.productHover {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
}

.productWrapper:hover .productHover {
    display: block;
}

.productinfos {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
}

.productinfos span {
    font-weight: bold;
}

.price {
    margin-top: 8px;
}

.price span {
    font-size: 18px;
    font-weight: bold;
}

div.paiementNf {
    width: 100%;
}
</style>