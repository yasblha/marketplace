<template>

    <div id="">
        <NavigationBar />
    </div>
    <section class="images" style="">

        <div>
            <span>We know how large objects will act, but things on a
                small scale just do not act that way.</span>
            <br>
            <button>Start now</button>
        </div>

    </section>

    <section class="produits">
        <div class="Oneproducts">
            <div class="texts">
                <span>Your Space</span>
                <h1>Unique <br> Life</h1>
                <span>Explore Items</span>
            </div>


            <img src="../assets/image2.png" alt="">

        </div>
        <div class="Oneproducts">
            <div class="texts">
                <span>Ends Today</span>
                <h1>Elements <br> Style </h1>
                <span>Explore Items</span>
            </div>


            <img src="../assets/image1.png" alt="">

        </div>
        <div class="Oneproducts">

            <div class="texts">
                <span>Your Space</span>
                <h1>Unique <br> Life</h1>
                <span>Explore Items</span>
            </div>

            <img src="../assets/image3.png" alt="">

        </div>

    </section>
    <section class="BestSellers">
        <div class="allitems">

            <div class="itemOne">

                <img src="" alt="">

            </div>

            <div class="itemTwo">
              <BestSellers_Products />
            </div>
        </div>
    </section>
    
    <br><br><br>

    <Footer />




</template>

<script>
import axiosInstance from "@/services/api";
import router from "../router/router";
import NavigationBar from "../components/UI/NavigationBar.vue";
import Footer from "../components/UI/Footer.vue";
import BestSellers_Products from "../components/UI/BestSellers_Products.vue";



export default {
    name: "Home",
    components: {
        NavigationBar,
        Footer,
        BestSellers_Products
    },

};
</script>

<style scoped>
.images {

    background-image: url('../assets/dumbels.jpg');
    background-size: cover;
    background-position: center;
    min-height: 40vw;
    display: flex;
    flex-direction: column;
    text-align: center;
}

.images button {

    background-color: rgba(35, 166, 240, 1);
    padding: 12px;
    outline: none;
    border: none;
    color: white;
    border-radius: 3px;
    width: 36%;
    font-size: 16px;
    margin-top: 19px;
}

.images div {

    margin: auto;
    width: 32%;
}

.images div span {

    margin: auto;
    color: #23a6f0;
    font-size: 18px;

}

section.produits {


    display: flex;
    padding: 61px;
    background: #80808012;
    text-align: center;
    justify-content: space-between;


}

div.Oneproducts {
    background-color: white;
    display: flex;
    padding: 14px;
    justify-content: center;
    box-shadow: inset 0 0 1em rgb(255 255 255), 0 0 1em rgb(160 148 148 / 33%);
}


.Oneproducts img {
    width: 244px;
    height: 181px;

}

div.texts {

    display: flex;
    flex-direction: column;
    margin: auto;
}

div.texts h1 {
    color: black;

}

div.texts span {

    color: #808080ad;
}

/* Best Sellers */

section.BestSellers {
    padding: 41px;
    width: 100%;
}

div.allitems {

    display: flex;
}

div.itemOne {

    background-image: url('../assets/card_items.jpg');
    width: 30%;

    background-size: cover;
    /* Pour couvrir toute la section */
    background-position: center;
}


div.itemTwo {
    width: 68%;
    margin: auto;


}

</style>
