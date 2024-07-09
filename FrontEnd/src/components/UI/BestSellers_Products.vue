<template>


    <div class="Categorie">
        <ul>
            <li>BESTSELLER PRODUCTS</li>
            <li><a href="">Men</a></li>
            <li><a href="">Women</a></li>
            <li><a href="">Accessories</a></li>

        </ul>
        <div class="fleches">
            <a href=""><img src="/src/assets/fg.svg" alt=""></a>
            <a href=""><img src="/src/assets/fd.svg" alt=""></a>
        </div>

    </div>
    <div class="bestProducts">

        <div class="product">
            <img src="/src/assets/image3.png" alt="">
            <h2>Graphic Design</h2>
            <p>English Departement</p>
            <div class="prices">
                <span class="priceNormal">$16,48</span>
                <span class="priceBlue">$6,48</span>
            </div>


        </div>

        <div class="product">
            <img src="/src/assets/image2.png" alt="">
            <h2>Graphic Design</h2>
            <p>English Departement</p>
            <div class="prices">
                <span class="priceNormal">$16,48</span>
                <span class="priceBlue">$6,48</span>
            </div>

        </div>

        <div class="product">
            <img src="/src/assets/image1.png" alt="">
            <h2>Graphic Design</h2>
            <p>English Departement</p>
            <div class="prices">
                <span class="priceNormal">$16,48</span>
                <span class="priceBlue">$6,48</span>
            </div>

        </div>
        <div class="product">
            <img src="/src/assets/image3.png" alt="">
            <h2>Graphic Design</h2>
            <p>English Departement</p>
            <div class="prices">
                <span class="priceNormal">$16,48</span>
                <span class="priceBlue">$6,48</span>
            </div>


        </div>

        <div class="product">
            <img src="/src/assets/image2.png" alt="">
            <h2>Graphic Design</h2>
            <p>English Departement</p>
            <div class="prices">
                <span class="priceNormal">$16,48</span>
                <span class="priceBlue">$6,48</span>
            </div>


        </div>
        <div class="product">
            <img src="/src/assets/image1.png" alt="">
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
    flex-wrap: wrap;
    text-align: center;
    margin-bottom: 20px;
}

div.Categorie ul {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin: 0;
}

div.fleches {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

div.fleches img {
    margin: 0 10px;
}

div.Categorie ul li {
    margin: 0 20px;
    font-size: 16px;
}

div.bestProducts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
    padding: 25px;
    width: 100%;
}

div.product {
    text-align: center;
}

div.product img {
    width: 100%;
    max-width: 200px;
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
    text-decoration: line-through;
}

.priceBlue {
    color: rgba(35, 133, 109, 1);
    margin-left: 5px;
}

/* Media Queries */
@media (max-width: 1200px) {
    div.Categorie {
        flex-direction: column;
        align-items: center;
    }

    div.Categorie ul {
        flex-direction: column;
    }

    div.Categorie ul li {
        margin: 10px 0;
    }

    div.bestProducts {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    div.bestProducts {
        grid-template-columns: 1fr;
    }

    div.Categorie ul {
        flex-direction: row;
        flex-wrap: wrap;
    }

    div.Categorie ul li {
        margin: 10px;
    }

    div.fleches img {
        width: 30px;
        height: 30px;
    }
}

@media (max-width: 480px) {
    div.Categorie ul li {
        font-size: 14px;
    }

    div.product h2 {
        font-size: 16px;
    }

    div.product p {
        font-size: 12px;
    }

    .priceNormal {
        font-size: 14px;
    }

    .priceBlue {
        font-size: 14px;
    }
}
</style>
