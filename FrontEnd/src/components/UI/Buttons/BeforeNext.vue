<template>

<div class="products-container">
                <div class="pagination-container">
                    <button @click="prevPage" class="pagination-button" :disabled="currentPage === 1">Précédent</button>

                    <div class="page-numbers">
                        <span class="page-number" v-for="pageNumber in displayedPages" :key="pageNumber"
                            @click="goToPage(pageNumber)" :class="{ 'active': currentPage === pageNumber }">{{
                                pageNumber }}</span>
                    </div>

                    <button @click="nextPage" class="pagination-button"
                        :disabled="currentPage === totalPages">Suivant</button>
                </div>

                <div class="products">
                    <ImageGrid v-for="(product, index) in products.slice(0, 36)" :key="index" :product="product" />
                </div>
            </div>
</template>


<script>

import axios from 'axios';
import { ref } from 'vue';
export default {
    name: 'NextBefore',

    data() {
        return {
            products: [],
            filteredProducts: [],
            currentPage: 1,
            totalPages: 36,
            perPage: 3,
            displayedPages: [],// // Number of products to display per page
        };
    },

    mounted() {
        this.fetchProducts();
    },

    methods: {
        fetchProducts() {
            axios.get('/api/products')
                .then(response => {
                    this.products = response.data;
                    this.filteredProducts = this.products.slice(0, this.perPage);
                    this.totalPages = Math.ceil(this.products.length / this.perPage);
                    this.updateDisplayedPages();
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateDisplayedPages();
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.updateDisplayedPages();
            }
        },

        goToPage(pageNumber) {
            this.currentPage = pageNumber;
            this.updateDisplayedPages();
        },

        updateDisplayedPages() {
            const halfWindow = Math.floor((this.perPage - 1) / 2); // Half the number of pages to display before and after current page
            const startPage = Math.max(1, this.currentPage - halfWindow);
            const endPage = Math.min(this.totalPages, this.currentPage + halfWindow);

            this.displayedPages = [];
            for (let i = startPage; i <= endPage; i++) {
                this.displayedPages.push(i);
            }
        },
    },

};

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