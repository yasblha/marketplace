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

    div.description {
        width: 100%;
        font-size: 11px;
    }

}
</style>