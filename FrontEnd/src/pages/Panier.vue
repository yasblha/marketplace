<template>
    <NavigationBar />

    <section>
        <div class="titles">
            <h2>Your cart</h2>
            <span>Not ready to checkout? Continue Shopping</span>
        </div>
        <div class="globalPanier">

            <div class="ProductFiche">

                <div class="produit">
                    <input type="checkbox" class="selected" checked>
                    <img src="/src/assets/outfit1.jpg" alt="">
                    <div class="infos">
                        <div class="titleChekbox">
                            <h3>Nom du produit</h3>
                            <span class="PriceNumber">$99</span>
                        </div>
                        <span>Size : L</span>
                        <div class="Qte">
                            <label for="quantitySelect">Quantité </label>
                            <div class="custom-select-container">
                                <select v-model="selectedQuantity" id="quantitySelect" class="selectQuantie">
                                    <option value="" disabled selected hidden>Choisissez une option...</option>
                                    <option v-for="num in 10" :key="num" :value="num">{{ num }}</option>
                                    <option value="+10">+10</option>
                                </select>
                                <input class="selectinput" v-if="selectedQuantity === '+10'" type="text"
                                    v-model="exactQuantity" placeholder="Quantité exacte">
                            </div>
                        </div>
                        <div class="priceDelete">
                            <button @click="removeProduct">Supprimer</button>
                        </div>
                    </div>
                </div>
                <!-- <div class="produit">
                    <img src="/src/assets/outfit3.jpg" alt="">
                    <div class="infos">
                        <div class="titleChekbox">
                            <h3>Nom du produit</h3>
                            <input type="checkbox" class="selected">

                        </div> <span>Size : L</span>
                        <span>Quantity:1</span>
                        <div class="priceDelete">
                            <span>$99</span>
                            <button @click="removeProduct">Remove</button>
                        </div>
                    </div>
                </div>
                <div class="produit">
                    <img src="/src/assets/outfit3.jpg" alt="">
                    <div class="infos">
                        <div class="titleChekbox">
                            <h3>Nom du produit</h3>
                            <input type="checkbox" class="selected">

                        </div> <span>Size : L</span>
                        <span>Quantity:1</span>
                        <div class="priceDelete">
                            <span>$99</span>
                            <button @click="removeProduct">Remove</button>
                        </div>
                    </div>
                </div>
                <div class="produit">
                    <img src="/src/assets/outfit3.jpg" alt="">
                    <div class="infos">
                        <div class="titleChekbox">
                            <h3>Nom du produit</h3>
                            <input type="checkbox" class="selected">

                        </div> <span>Size : L</span>
                        <span>Quantity:1</span>
                        <div class="priceDelete">
                            <span>$99</span>
                            <button @click="removeProduct">Remove</button>
                        </div>
                    </div>
                </div> -->

                <div class="SelectAll">
                    <span>Tout selectionner</span>
                    <input type="checkbox" id="selectAll">

                </div>
            </div>
            <div class="paiments">
                <h2>Order Summary</h2>
                <input type="text" placeholder="Enter coupon code here">
                <br><br>
                <div>
                    <span>Subtotal</span>
                    <span>$99</span>
                </div>
                <div>

                    <span>Shipping</span>
                    <span>Calculated at the next step</span>
                </div>
                <div>

                    <span>total</span>
                    <span>$100</span>
                </div>
                <br>
                <br>
                <button>Continue to checkout</button>


            </div>

        </div>

        <div class="OrderF">
            <h3>Order Information</h3>
            <div class="buttonAndText">
                <div class="">
                    <span>Return Policy</span>
                    <button @click="toggleText('text1')">{{ isText1Visible ? '-' : '+' }}</button>
                </div>
                <p v-show="isText1Visible" class="text1">This is our example return policy which is everything you need
                    to know about our returns.</p>
            </div>
            <div class="buttonAndText">
                <div class="">
                    <span>Shipping Options</span>
                    <button @click="toggleText('text2')">{{ isText2Visible ? '-' : '+' }}</button>
                </div>
                <p v-show="isText2Visible" class="text2">This is our example return policy which is everything you need
                    to know about our returns.</p>
            </div>
            <br>
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

    name: 'Panier',

    components: {

        NavigationBar,
        Footer,
        FicheProducts,
        Paiement_product,
        Sizes,
    },
    data() {
        return {
            isText1Visible: false,
            isText2Visible: false,
        };

    },
    data() {

        return {
            selectedQuantity: null, // Pour stocker la quantité sélectionnée
            exactQuantity: 1 // Par défaut, la quantité exacte est 1
        };
    },

    mounted() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const productCheckboxes = document.querySelectorAll('.selected');

        selectAllCheckbox.addEventListener('change', () => {
            const isChecked = selectAllCheckbox.checked;
            productCheckboxes.forEach((checkbox) => {
                checkbox.checked = isChecked;
            });
        });
    },
    methods: {
        toggleText(text) {
            if (text === 'text1') {
                this.isText1Visible = !this.isText1Visible;
            } else if (text === 'text2') {
                this.isText2Visible = !this.isText2Visible;
            }
        },
    },
    methods: {
        removeProduct(event) {
            // Trouver le parent `.produit` du bouton cliqué
            const productElement = event.target.closest('.produit');
            if (productElement) {
                // Supprimer l'élément du DOM
                productElement.remove();
            }
        },
        toggleText(text) {
            // méthode existante pour afficher/masquer du texte
        },
    },

};
</script>

<style scoped>
div.globalPanier {
    display: flex;
    margin: 39px;
    justify-content: space-around;
}

.selectQuantie {
    margin-left: 9px;
    background: #8080802e;
    border-radius: 4px;
    border: 1px solid #80808085;
    outline: none;
    width: 25%;
    padding: 3px;

}

.selectinput {
    padding: 4px;
    width: 21%;
    margin-left: 10px;
    border-radius: 5px;
    outline: none;
    border: 1px solid grey;

}

div.Qte {
    display: flex;
}

div.titles {
    margin: 18px 159px;
    display: flex;
    flex-direction: column;
}


div.titles span {}

div.titles h2 {
    font-weight: 600;
}

div.ProductFiche {
    width: 43%;
}

div.produit img {
    width: 151px;
    height: 154px;
    object-fit: cover;


}

.selected {

    margin-right: 10px;
}

div.titleChekbox {

    display: flex;
    justify-content: space-between
}

.PriceNumber {

    font-size: 22px;
    font-weight: 500;
}

/* div.infos input {
    width: 6%;
} */

div.produit {
    display: flex;
    padding-top: 14px;
    border-bottom: 1px solid #8080804a;

}

div.infos {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    height: 100%;
    padding: 15px;
    width: 100%;
    margin: auto;
}

div.infos span {}

div.infos h3 {

    font-size: 25px;
    font-weight: 600;
}

div.priceDelete {
    display: flex;
    justify-content: space-between;
}

div.priceDelete span {
    font-size: 22px;
    font-weight: 600;

}


div.priceDelete button {

    background: none;
    border: none;
    color: #007185 !important;
    padding-top: 10px;
    cursor: pointer;
}

div.paiments {
    margin-left: 54px;
    padding: 12px;
    width: 30%;
}

div.paiments h2 {
    margin-bottom: 15px;
}

div.paiments input {
    width: 100%;
    padding: 6px;
}

div.paiments div {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

div.paiments span {}

div.paiments button {

    padding: 8px;
    width: 100%;
    background: black;
    color: white;
    border: none;
}

div.OrderF {
    padding: 22px;
    /* width: 100%; */
    margin-left: 95px;
}

div.OrderF h3 {
    font-size: 29px;
    font-weight: 600;
    border-bottom: 2px solid black;
    width: 24%;
    margin-bottom: 23px;
}

div.buttonAndText {
    color: grey;
    border-bottom: 1px solid;
    width: 53%;
    padding-bottom: 17px;

}

div.buttonAndText div span {}

div.buttonAndText div button {

    color: grey;
    background: none;
    border: none;
    font-size: 19px;
    cursor: pointer;


}

div.buttonAndText div {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 17px;

}

div.buttonAndText p {
    font-size: 12px;

}

div.SelectAll {

    display: flex;
    justify-content: space-around;
    margin: 28px;

}

div.SelectAll span {}

div.SelectAll input {
    width: 4%;
}


@media (max-width: 1200px) {
    div.globalPanier {
        flex-direction: column;
        align-items: center;
    }

    div.paiments {
        margin-left: 0;
        width: 80%;
    }

    div.ProductFiche {
        width: 80%;
    }

    div.OrderF {
        margin-left: 0;
        width: 80%;
    }

    div.OrderF h3 {
        width: 100%;
    }
}

@media (max-width: 768px) {
    div.globalPanier {
        margin: 20px;
    }

    div.titles {
        margin: 20px 0;
        text-align: center;
    }

    div.titles h2 {
        font-size: 24px;
    }

    div.ProductFiche {
        width: 100%;
    }

    div.paiments {
        width: 100%;
        margin-left: 0;
    }

    div.OrderF {
        width: 100%;
        margin-left: 0;
        padding: 0 20px;
    }

    div.buttonAndText {
        width: 100%;
    }
}

@media (max-width: 480px) {
    div.globalPanier {
        margin: 10px;
    }

    div.titles h2 {
        font-size: 20px;
    }

    div.produit img {
        width: 100px;
        height: 100px;
    }

    div.produit {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    div.infos {
        padding: 10px;
    }

    div.infos h3 {
        font-size: 20px;
    }

    div.priceDelete {
        flex-direction: column;
        align-items: center;
    }

    div.priceDelete span {
        font-size: 18px;
    }

    div.priceDelete button {
        margin-top: 10px;
    }

    div.paiments {
        width: 100%;
    }

    div.paiments input {
        padding: 8px;
    }

    div.paiments div {
        font-size: 12px;
    }

    div.paiments button {
        padding: 10px;
    }

    div.OrderF h3 {
        font-size: 24px;
    }

    div.OrderF {
        width: 100%;
        margin-left: 0;
    }

    div.SelectAll span {
        font-size: 14px;
    }

    div.SelectAll input {
        width: 5%;
    }
}
</style>