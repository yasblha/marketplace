<template>

    <div class="itemsView">

        <a href="/OneProduct">
            <div class="OneProduct">
                <img src="/src/assets/outfit1.jpg" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>
            </div>
        </a>

        <a href="/OneProduct">
            <div class="OneProduct">
                <img src="/src/assets/outfit2.jpg" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>
            </div>
        </a>

        <a href="/OneProduct">

            <div class="OneProduct">
                <img src="/src/assets/outfit3.jpg" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>
            </div>
        </a>

        <a href="/OneProduct">
            <div class="OneProduct">
                <img src="/src/assets/outfit4.jpg" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>
            </div>
        </a>

        <a href="/OneProduct">
            <div class="OneProduct">
                <img src="/src/assets/outfit3.jpg" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>
            </div>

        </a>

        <a href="/OneProduct">
            <div class="OneProduct">
                <img src="/src/assets/outfit2.jpg" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>
            </div>
        </a>


        <a href="/OneProduct">

            <div class="OneProduct">
                <img src="/src/assets/outfit1.jpg" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>
            </div>
        </a>

        <a href="/OneProduct">
            <div class="OneProduct">
                <img src="/src/assets/outfit4.jpg" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>
            </div>

        </a>

        <a href="/OneProduct">

            <div class="OneProduct">
                <img src="/src/assets/outfit2.jpg" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>
            </div>
        </a>

    </div>
</template>

<script>
export default {
    name: 'FicheProducts',
};
</script>

<style scoped>
div.itemsView {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 25px auto;
    padding: 0 15px;
    max-width: 1200px; /* Limitez la largeur maximale */
}

div.OneProduct {
    text-align: center;
    padding: 17px;
    margin: auto;
}

div.OneProduct img {
    object-fit: cover;
    width: 100%;
    max-width: 100%;
    height: auto;
    margin-bottom: 10px; /* Ajoutez un espace entre l'image et le texte */
}

div.OneProduct h2 {
    font-size: 18px; /* Ajustez la taille de la police */
    margin-top: 6px;
}

div.OneProduct p {
    font-size: 14px;
    color: grey;
    margin-bottom: 10px; /* Ajoutez un espace en bas du paragraphe */
}

div.prices {
    margin-top: 6px;
}

.priceNormal {
    color: grey;
}

.priceBlue {
    color: rgba(35, 133, 109, 1);
    margin-left: 5px;
}

/* Media Queries */
@media (max-width: 1024px) {
    div.itemsView {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 15px;
        padding: 0 10px;
    }

    div.OneProduct h2 {
        font-size: 16px;
    }

    div.OneProduct p {
        font-size: 13px;
    }
}

@media (max-width: 768px) {
    div.itemsView {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
        padding: 0 5px;
    }

    div.OneProduct h2 {
        font-size: 14px;
    }

    div.OneProduct p {
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    div.OneProduct h2 {
        font-size: 12px;
    }

    div.OneProduct p {
        font-size: 10px;
    }
}
</style>