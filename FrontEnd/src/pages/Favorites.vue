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

            <div class="produit">
                <img class="productImage" src="/src/assets/outfit2.jpg" alt="">
                <div class="productinfos">
                    <span>Nom produit</span>
                    <img src="/src/assets/Heart.png" alt="">
                </div>
                <div class="price">
                    <span>$99</span>
                </div>
            </div>
            <div class="produit">
                <img  class="productImage"  src="/src/assets/outfit1.jpg" alt="">
                <div class="productinfos">
                    <span>Nom produit</span>
                    <img src="/src/assets/Heart.png" alt="">
                </div>
                <div class="price">
                    <span>$99</span>
                </div>
            </div>

            <div class="produit">
                <img class="productImage"  src="/src/assets/outfit3.jpg" alt="">
                <div class="productinfos">
                    <span>Nom produit</span>
                    <img src="/src/assets/Heart.png" alt="">
                </div>
                <div class="price">
                    <span>$99</span>
                </div>
            </div>
            <div class="produit">
                <img class="productImage"  src="/src/assets/outfit3.jpg" alt="">
                <div class="productinfos">
                    <span>Nom produit</span>
                    <img src="/src/assets/Heart.png" alt="">
                </div>
                <div class="price">
                    <span>$99</span>
                </div>
            </div>
            <div class="produit">
                <img class="productImage"  src="/src/assets/outfit3.jpg" alt="">
                <div class="productinfos">
                    <span>Nom produit</span>
                    <img src="/src/assets/Heart.png" alt="">
                </div>
                <div class="price">
                    <span>$99</span>
                </div>
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

    name: 'Favorites',

    components: {

        NavigationBar,
        Footer,
        FicheProducts,
        Paiement_product,
        Sizes,
    },


};
</script>

<style scoped>
section{
    padding: 18px;
}

div.titles{
text-align: center;
}

div.titles h1{

    
}
div.buttonShopAll{
    text-align: center;
    margin: 23px;

}
div.buttonShopAll button{
    border: 1px solid black;
    padding: 9px;
    width: 10%;
    background: whitesmoke;
    
}
div.lesproduits{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

}
div.produit{

    width: 20%;
    margin-left: 4px;
    padding: 17px;
}
.productImage{
    width: -webkit-fill-available;
    /* text-align: center; */
    margin: auto;
    height: auto;

    
}
div.productinfos{
    display: flex;
}
div.productinfos span{
    
}
div.productinfos img{
    width: 16px;
    height: 16px;
    margin-left: auto;}

div.price{

}
div.price span{


}

</style>