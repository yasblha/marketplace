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
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    /* gap: 10px; */
    margin: 25px auto;
    width: 78%;
}

div.OneProduct {
    width: 100%;
    text-align: center;
    padding: 17px;
    margin: auto;
}

div.OneProduct img {

    object-fit: cover;
    width: 197px;
    height: 206px;
}

div.OneProduct h2 {
    font-size: 19px;
    color: black;
    margin-top: 6px;
}

div.OneProduct p {
    font-size: 14px;
    color: grey;
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
</style>