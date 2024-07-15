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
            

            <img src="/src/assets/image2.png" alt="">

        </div>
        <div class="Oneproducts">
            <div class="texts">
                <span>Ends Today</span>
                <h1>Elements <br> Style </h1>
                <span>Explore Items</span>
            </div>

            <img src="/src/assets/image1.png" alt="">

        </div>
        <div class="Oneproducts">

            <div class="texts">
                <span>Your Space</span>
                <h1>Unique <br> Life</h1>
                <span>Explore Items</span>
            </div>

            <img src="/src/assets/image3.png" alt="">

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
/* Styles pour écrans larges */
.images {
    background-image: url('/src/assets/dumbels.jpg');
    background-size: cover;
    background-position: center;
    min-height: 40vw; /* Hauteur minimale en fonction de la largeur de l'écran */
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 80px 20px; /* Espacement ajusté */
}

.images button {
    background-color: rgba(35, 166, 240, 1);
    padding: 12px;
    outline: none;
    border: none;
    color: white;
    border-radius: 3px;
    width: 200px; /* Largeur fixe pour le bouton */
    font-size: 16px;
    margin-top: 20px;
}

.images div {
    margin: auto;
    width: 50%;
}

.images div span {
    margin: auto;
    color: #23a6f0;
    font-size: 20px; /* Taille de police ajustée */
}

section.produits {
    display: flex;
    flex-wrap: wrap; /* Permet aux éléments de passer à la ligne sur les petits écrans */
    padding: 40px;
    background: #80808012;
    text-align: center;
    justify-content: space-around; /* Espacement uniforme entre les éléments */
}

div.Oneproducts {
    background-color: white;
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    padding: 20px;
    margin: 20px;
    width: calc(33.33% - 40px); /* Calcul de la largeur avec marges pour s'adapter à la grille */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.Oneproducts img {
    width: 60%; /* Image occupant toute la largeur du conteneur */
    height: auto;
}

div.texts {
    margin-bottom: 10px; /* Espacement en bas du texte */
    text-align: center;
}

div.texts h1 {
    color: black;
    font-size: 24px; /* Taille de police ajustée */
}

div.texts span {
    color: #808080ad;
    font-size: 16px; /* Taille de police ajustée */
}

section.BestSellers {
    padding: 40px;
}

div.allitems {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

div.itemOne {
    background-image: url('/src/assets/card_items.jpg');
    background-size: cover;
    background-position: center;
    width: 300px;
    height: 200px;
}

div.itemTwo {
    width: 70%; /* Largeur ajustée */
    max-width: 600px; /* Largeur maximale pour éviter l'étirement */
    margin-top: 20px; /* Espacement en haut */
    margin-bottom: 20px; /* Espacement en bas */
    text-align: center;
}

/* Media Queries pour écrans de taille moyenne */
@media (max-width: 1024px) {
    .images {
        padding: 60px 10px;
    }

    .images button {
        width: 180px;
        font-size: 14px;
    }

    .images div span {
        font-size: 18px;
    }

    section.produits {
        padding: 30px;
    }

    div.Oneproducts {
        width: calc(50% - 40px);
    }
}

/* Media Queries pour écrans petits */
@media (max-width: 768px) {
    .images {
        min-height: auto;
    }

    .images button {
        width: 160px;
        font-size: 14px;
    }

    .images div span {
        font-size: 16px;
    }

    section.produits {
        padding: 20px;
    }

    div.Oneproducts {
        width: calc(100% - 40px);
    }

    div.allitems {
        flex-direction: column;
        align-items: center;
    }

    div.itemOne {
        width: 100%;
        height: 300px;
    }

    div.itemTwo {
        width: 90%;
    }
}

/* Media Queries pour écrans très petits */
@media (max-width: 480px) {
    .images button {
        width: 140px;
        font-size: 12px;
    }

    .images div span {
        font-size: 14px;
    }

    div.Oneproducts {
        padding: 15px;
    }

    div.texts h1 {
        font-size: 20px;
    }

    div.texts span {
        font-size: 14px;
    }
}
</style>