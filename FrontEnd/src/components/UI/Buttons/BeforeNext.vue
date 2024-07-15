<template>
    <div class="products-container">
        <div class="pagination-container">
            <button @click="prevPage" class="pagination-button" :disabled="currentPage === 1">Précédent</button>

            <div class="page-numbers">
                <span class="page-number" v-for="pageNumber in displayedPages" :key="pageNumber"
                    @click="goToPage(pageNumber)" :class="{ 'active': currentPage === pageNumber }">
                    {{ pageNumber }}
                </span>
            </div>

            <button @click="nextPage" class="pagination-button" :disabled="currentPage === totalPages">Suivant</button>
        </div>

        <div class="products">
            <ImageGrid v-for="(product, index) in displayedProducts" :key="index" :product="product" />
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

const currentPage = ref<number>(1); // Specify currentPage as number type
const totalPages = ref<number>(36); // Specify totalPages as number type
const perPage = ref<number>(3); // Specify perPage as number type
const displayedPages = ref<number[]>([]); // Specify type for displayedPages

let products = ref<any[]>([]); // Change to match your product data structure
let displayedProducts = ref<any[]>([]); // Change to match your product data structure

const fetchProducts = () => {
    axios.get('/api/products')
        .then(response => {
            products.value = response.data;
            displayedProducts.value = products.value.slice(0, perPage.value);
            totalPages.value = Math.ceil(products.value.length / perPage.value);
            updateDisplayedPages();
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        updateDisplayedPages();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        updateDisplayedPages();
    }
};

const goToPage = (pageNumber: number) => { // Specify pageNumber as number type
    currentPage.value = pageNumber;
    updateDisplayedPages();
};

const updateDisplayedPages = () => {
    const halfWindow = Math.floor((perPage.value - 1) / 2);
    const startPage = Math.max(1, currentPage.value - halfWindow);
    const endPage = Math.min(totalPages.value, currentPage.value + halfWindow);

    displayedPages.value = [];
    for (let i = startPage; i <= endPage; i++) {
        displayedPages.value.push(i);
    }

    // Update displayed products based on current page
    const startIndex = (currentPage.value - 1) * perPage.value;
    displayedProducts.value = products.value.slice(startIndex, startIndex + perPage.value);
};

onMounted(fetchProducts);
</script>

<style scoped>
.products-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.pagination-button {
    background-color: #ccc;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.pagination-button:hover {
    background-color: #aaa;
}

.current-page {
    margin: 0 10px;
}

.products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 20px;
}
</style>
