<template>


    <NavigationBar />

    <section class="produits">

        <div class="GlobalItem">


            <div class="images" :style="{ gridTemplateColumns: gridTemplateColumns }">

                <img src="/src/assets/outfit1.jpg" alt="">
                <img src="/src/assets/outfit3.jpg" alt="">
                <img src="/src/assets/outfit2.jpg" alt="">
                <img src="/src/assets/outfit4.jpg" alt="">

            </div>

            <div class="itemDetails">

                <h2>Natural Honey Bottle</h2>
                <span>$99</span>
                <div class="description">
                    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                    <br>
                    <span class="source">By Vendor Name</span>
                </div>
                <Sizes />
                <Paiement_product />


            </div>


        </div>

    </section>

    <Footer />

</template>


<script>

import axiosInstance from "@/services/api";
import router from "../router/router";
import NavigationBar from "../components/UI/NavigationBar.vue";
import Footer from "../components/UI/Footer.vue";
import BestSellers_Products from "../components/UI/BestSellers_Products.vue";
import FicheProducts from "../components/UI/FicheProducts.vue";
import Paiement_product from "../components/UI/Buttons/Paiement_product.vue";
import Sizes from "../components/UI/Buttons/Sizes.vue";



export default {

    name: 'OneProduct',

    components: {

        NavigationBar,
        Footer,
        FicheProducts,
        Paiement_product,
        Sizes,
    },
    // props: {
    //   nbImages: Number,
    //   images: Array, // Array of image data
    // },
    // computed: {
    //   gridTemplateColumns() {
    //     if (this.nbImages === 1) {
    //       return 'flex';
    //     } else if (this.nbImages === 2) {
    //       return 'repeat(2, 1fr)';
    //     } else {
    //       return 'repeat(auto-fit, minmax(250px, 1fr))'; // Responsive grid
    //     }
    //   },
    // },

};




</script>

<style>
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
    /* border: 1px solid grey; */
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

    WIDTH: 70%;
    font-size: 14px;
}

div.description span {

    font-weight: 600;

}

span.source {}
</style>