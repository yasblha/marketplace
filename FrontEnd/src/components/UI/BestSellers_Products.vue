<template>

   
        <div class="Categorie">
            <ul>
                <li>BESTSELLER PRODUCTS</li>
                <li><a href="">Men</a></li>
                <li><a href="">Women</a></li>
                <li><a href="">Accessories</a></li>

            </ul>
            <div class="fleches">
                <a href=""><img src="../../assets/fg.svg" alt=""></a>
                <a href=""><img src="../../assets/fd.svg" alt=""></a>
            </div>

        </div>
        <div class="bestProducts">

            <div class="product">
                <img src="../../assets/image3.png" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>


            </div>

            <div class="product">
                <img src="../../assets/image2.png" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>


            </div>
            <div class="product">
                <img src="../../assets/image1.png" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>

            </div>
            <div class="product">
                <img src="../../assets/image3.png" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>


            </div>

            <div class="product">
                <img src="../../assets/image2.png" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>


            </div>
            <div class="product">
                <img src="../../assets/image1.png" alt="">
                <h2>Graphic Design</h2>
                <p>English Departement</p>
                <div class="prices">
                    <span class="priceNormal">$16,48</span>
                    <span class="priceBlue">$6,48</span>
                </div>

            </div>

        </div>

    

</template>
<script>
export default {
    name: 'BestSellers_Products',
};
</script>

<style scoped>


div.Categorie {
    display: flex;
    justify-content: space-evenly;

}

div.Categorie ul {
    display: flex;
    justify-content: space-evenly;
    list-style: none;
}

div.fleches {
    display: contents;
}

div.fleches img {
    /* width: 100%;
    border-radius: 100%;
    border: 1px solid grey; */

}

div.Categorie ul li {

    margin-left: 59px;
}



div.Categorie div {}

div.bestProducts {

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 10px;
    padding: 25px;
    width: 100%;
    height: 100vh;
}

div.product {

    text-align: right;
}

div.product img {
    width: 76%;
}

div.product h2 {
    font-size: 19px;
}

div.product p {

    color: grey;
    font-size: 13px;
}

.priceNormal {

    color: grey;
}

.priceBlue {

    color: rgba(35, 133, 109, 1);
    margin-left: 5px;

}
</style>