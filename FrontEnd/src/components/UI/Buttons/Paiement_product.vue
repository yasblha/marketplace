<template>
    <div class="buttons">
        <a href="">Add tyo to cart</a>
        <div class="qte">
            <label for="">Quantity</label>
            <div class="inputs">
                <button class="moins">-</button>
                <input type="number" value="1" min="1" max="100">
                <button class="plus">+</button>
            </div>

        </div>
    </div>
</template>

<script>
export default {

name: 'Paiement_product',

};

</script>
<style scoped>


div.buttons a {

background: black;
text-align: center;
padding: 8px;
width: 48%;
color: white;
}

div.buttons {

margin-top: 12px;
display: flex;
}

div.qte {
margin-left: 9px;
display: flex;
text-align: center;
width: 20%;
flex-direction: column;
}

div.qte label {
color: grey;
font-size: 11px;
}


div.inputs {
display: flex;



}

div.inputs button {

padding: 5px 10px;
border: none;
cursor: pointer;
background: none;
}

div.inputs input {
width: 50px;
text-align: center;
}

</style>