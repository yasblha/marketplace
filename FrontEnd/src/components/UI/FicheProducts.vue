<template>
    <div class="itemsView">
        <a :href="'/product/' + product._id" v-for="product in productList" :key="product._id">
            <div class="OneProduct">
                <img :src="product.images[0]" :alt="product.name">
                <h2>{{ product.name }}</h2>
                <p>{{ product.category }}</p>
                <div class="prices">
                    <span class="priceNormal">${{ product.price.toFixed(2) }}</span>
                    <span class="priceBlue">${{ (product.price * 0.6).toFixed(2) }}</span>
                </div>
                <div class="hoverButtons">
                    <button class="addToCart">Add to Cart</button>
                    <div>
                        <FavoritesIcon :isInitiallyFavorited="product.isFavorited"
                            @update:isFavorited="(isFavorited) => updateFavorite(product._id, isFavorited)" />
                    </div>
                </div>
            </div>
        </a>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '@/products_simulate/product_data';
import { products } from '@/products_simulate/product_data';
import FavoritesIcon from '@/components/UI/Buttons/FavoritesIcon.vue';

const productList = ref<Product[]>(products);

const updateFavorite = (productId: string, isFavorited: boolean) => {
    const product = productList.value.find(p => p._id === productId);
    if (product) {
        product.isFavorited = isFavorited;
    }
};
</script>

<style scoped>
div.itemsView {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 25px auto;
    padding: 0 15px;
    max-width: 1200px;
    /* Limitez la largeur maximale */
}

div.OneProduct {
    position: relative;
    text-align: center;
    padding: 17px;
    margin: auto;
    width: 279px;
    transition: background-color 0.3s;
}

div.OneProduct:hover {
    background-color: rgba(255, 255, 255, 0.8);
    opacity: 0.7;
}

div.OneProduct img {
    object-fit: cover;
    width: 100%;
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
    /* Ajoutez un espace entre l'image et le texte */
}

div.OneProduct h2 {
    font-size: 18px;
    /* Ajustez la taille de la police */
    margin-top: 6px;
}

div.OneProduct p {
    font-size: 14px;
    color: grey;
    margin-bottom: 10px;
    /* Ajoutez un espace en bas du paragraphe */
}

div.prices {
    margin-top: 6px;
}

.priceNormal {
    color: grey;
}

.priceBlue {
    color: rgba(35, 133, 109, 1);
    margin-left: 5px;
}

div.hoverButtons {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    flex-direction: column;
    align-items: center;
}

div.OneProduct:hover div.hoverButtons {
    display: flex;
}

button.addToCart,
button.svgButton {
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    background-color: rgba(35, 133, 109, 1);
    color: white;
    cursor: pointer;
    border-radius: 5px;
    font-size: 14px;
}

button.svgButton {
    background-color: rgba(50, 50, 50, 0.7);
}

button.addToCart:hover,
button.svgButton:hover {
    background-color: rgba(35, 133, 109, 0.8);
}

button.svgButton:hover {
    background-color: rgba(50, 50, 50, 0.5);
}

/* Media Queries */
@media (max-width: 1024px) {
    div.itemsView {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 15px;
        padding: 0 10px;
    }

    div.OneProduct h2 {
        font-size: 16px;
    }

    div.OneProduct p {
        font-size: 13px;
    }
}

@media (max-width: 768px) {
    div.itemsView {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
        padding: 0 5px;
    }

    div.OneProduct h2 {
        font-size: 14px;
    }

    div.OneProduct p {
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    div.OneProduct h2 {
        font-size: 12px;
    }

    div.OneProduct p {
        font-size: 10px;
    }
}
</style>
