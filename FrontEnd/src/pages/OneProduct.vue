<template>
    <NavigationBar />

    <section class="produits">
        <div class="GlobalItem" v-if="product">
            <div class="images">
                <img v-for="image in product.images" :src="image" :key="image" alt="">
            </div>

            <div class="itemDetails">
                <h2>{{ product.name }}</h2>
                <span>{{ product.price }}</span>
                <div class="description">
                    <span>{{ product.description }}</span>
                    <br>
                    <span class="source">By {{ product.vendor }}</span>
                </div>
                <Sizes />
                <Paiement_product />
            </div>
        </div>
    </section>

    <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import NavigationBar from "../components/UI/NavigationBar.vue";
import Footer from "../components/UI/Footer.vue";
import Paiement_product from "../components/UI/Buttons/Paiement_product.vue";
import Sizes from "../components/UI/Buttons/Sizes.vue";

interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    vendor: string;
    price: number;
    images: string[];
}

const route = useRoute();
const productId = route.params.id as string;
const product = ref<Product | null>(null);

const mockProducts: Product[] = [
    {
        _id: '1',
        name: 'Natural Honey Bottle',
        description: 'Pure honey harvested from organic farms.',
        category: 'Food',
        vendor: 'HoneyVendor',
        price: 99.99,
        images: [
            '/src/assets/outfit1.jpg',
            '/src/assets/outfit2.jpg',
            '/src/assets/outfit3.jpg',
            '/src/assets/outfit4.jpg'
        ]
    },
    // Add more mock products as needed
];

const fetchProductById = (id: string): Product | undefined => {
    return mockProducts.find(product => product._id === id);
};

onMounted(() => {
    product.value = fetchProductById(productId) || null;
});
</script>

<style scoped>

section {}

div.GlobalItem {
    display: flex;
    margin: auto;
    width: 82%;
}

div.itemDtails {}

div.images {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    padding: 49px;
}

div.images img {
    width: 195px;
    height: 225px;
    padding: 7px;
}

div.itemDetails {
    padding: 44px;
    width: 100%;
}

div.itemDetails h2 {
    font-weight: 700;
}

div.itemDetails span {}

div.description {
    width: 70%;
    font-size: 14px;
}

div.description span {
    font-weight: 600;
}

span.source {}

@media (max-width: 1200px) {
    div.GlobalItem {
        flex-direction: column;
        align-items: center;
    }

    div.images {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
        padding: 20px;
    }

    div.itemDetails {
        padding: 20px;
        text-align: center;
    }

    div.description {
        width: 80%;
        font-size: 13px;
    }
}

@media (max-width: 768px) {
    div.GlobalItem {
        flex-direction: column;
        align-items: center;
    }

    div.images {
        grid-template-columns: 1fr;
        padding: 20px;
    }

    div.images img {
        width: 100%;
        padding: 7px;
    }

    div.itemDetails {
        padding: 20px;
        text-align: center;
    }

    div.description {
        width: 90%;
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    div.images {
        padding: 10px;
    }

    div.images img {
        padding: 5px;
    }

    div.itemDetails {
        padding: 10px;
    }

}
</style>
