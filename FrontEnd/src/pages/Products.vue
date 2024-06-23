<template>

    <NavigationBar />

    <section class="">

        <div class="Barshop">

            <h2>Shop</h2>
            <div>
                <a href="">Home</a>
                <a href=""><img src="../assets/fd.svg" alt=""></a>
                <a href="">Shop</a>
            </div>
        </div>

        <div class="Categ">
            <div class="item5">
                <div>
                    <span>CLOTHS</span>
                </div>


            </div>
            <div class="item6">
                <div>
                    <span>CLOTHS</span>
                </div>


            </div>
            <div class="item7">
                <div>
                    <span>CLOTHS</span>
                </div>


            </div>
            <div class="item8">
                <div>
                    <span>CLOTHS</span>
                </div>


            </div>
            <div class="item9">
                <div>
                    <span>CLOTHS</span>
                </div>

            </div>
        </div>
        <div class="LesProd">

            <div class="filtreBar">
                <div class="Showing">
                    <span>Showing all 12 results</span>
                </div>
                <div class="views">
                    <span>Views:</span>
                    <img src="../assets/Menu.png" alt="">
                    <img src="../assets/Menu2.png" alt="">

                </div>
                <div class="PandF">
                    <a href="" class="Popularity">Popularity</a>
                    <a href="" class="Filter">Filter</a>
                </div>

            </div>
           <FicheProducts />
           <Footer />
                
        </div>

    </section>



</template>

<script>
import axiosInstance from "@/services/api";
import router from "../router/router";
import NavigationBar from "../components/UI/NavigationBar.vue";
import Footer from "../components/UI/Footer.vue";
import BestSellers_Products from "../components/UI/BestSellers_Products.vue";
import FicheProducts from "../components/UI/FicheProducts.vue";
//import '@fortawesome/fontawesome-free/css/all.css';

export default {

    name: 'Products',

    components: {

        NavigationBar,
        Footer,
        FicheProducts
    }
};

</script>


<style scoped>

div.Barshop {

    padding: 11px;
    display: flex;
    justify-content: space-around;
    WIDTH: 100%;
    margin: auto;
    margin-top: 16px;

}

.Barshop h2 {
    color: rgba(37, 43, 66, 1);
    font-weight: 600;
}

.Barshop div {
    display: flex;

}

.Barshop div a {
    margin-left: 12px;
    font-size: 14px;
    color: black;
}

.Barshop div img {}

div.Categ {

    display: flex;
    width: 82%;
    padding: 36px;
    margin: auto;

}

div.Categ div {
    height: 206px;
    background-size: cover;
    background-position: center;
    width: 20%;
    margin-left: 7px;
    Z-INDEX: 1;
    OPACITY: 0.8;

}

div.item5 {
    background-image: url('../assets/items51.jpg');
}

div.item6 {

    background-image: url('../assets/items52.jpg');

}

div.item7 {
    background-image: url('../assets/items53.jpg');
}

div.item8 {

    background-image: url('../assets/items54.jpg');
}

div.item9 {

    background-image: url('../assets/items55.jpg');
}

div.Categ div div {
    display: flex;
    text-align: center;
    margin: auto;
}

div.Categ div div span {
    margin: auto;
    color: white;
    z-index: 3;
    font-weight: 600;
    font-size: medium;
}
/* Components */

div.filtreBar {
    display: flex;
    width: 100%;
    justify-content: space-around;
}

.showing {

    display: flex;
}

.showing span {}

div.views {

    display: flex;
}

div.views span {}

div.views img {
    width: 15%;
    height: 14px;
    /* margin-left: 11px; */
    margin: auto 10px;


}

div.PandF {}

.Popularity {

    padding: 10px;
    border: 1px solid #8080807a;
    border-radius: 7px;
    color: grey;
    font-size: 12px;
}

.Filter {
    padding: 10px 18px;
    background-color: rgba(35, 166, 240, 1);
    margin-left: 6px;
    border-radius: 7px;
    color: white;
    text-align: center;
    font-size: 12px;

}

</style>