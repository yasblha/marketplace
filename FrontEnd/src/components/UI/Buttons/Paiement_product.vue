<!-- Paiement_product.vue -->
<template>
  <div class="buttons">
    <button @click="emitAddToCart" :disabled="!isInStock">
      {{ isInStock ? 'Add to Cart' : 'Out of Stock' }}
    </button>
    <div class="qte">
      <label for="">Quantity</label>
      <div class="inputs">
        <button class="moins" @click="decreaseQuantity">-</button>
        <input type="number" v-model="quantity" :min="1" :max="maxQuantity" @input="validateQuantity">
        <button class="plus" @click="increaseQuantity">+</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps } from 'vue';
import { useCartStore } from '@/stores/cart';

const props = defineProps<{ productId: string }>();
const emit = defineEmits(['addToCart']);

const quantity = ref(1);
const cartStore = useCartStore();

const product = computed(() => {
  return cartStore.products.find(p => p._id === props.productId);
});

const maxQuantity = computed(() => {
  return product.value ? product.value.stock_available : 1;
});

const isInStock = computed(() => {
  return product.value ? product.value.stock_available > 0 : false;
});

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const increaseQuantity = () => {
  if (quantity.value < maxQuantity.value) {
    quantity.value++;
  }
};

const validateQuantity = () => {
  if (quantity.value > maxQuantity.value) {
    quantity.value = maxQuantity.value;
  }
  if (quantity.value < 1) {
    quantity.value = 1;
  }
};

const emitAddToCart = () => {
  if (quantity.value <= maxQuantity.value && product.value) {
    console.log('Adding product to cart:', product.value._id, 'Quantity:', quantity.value);
    cartStore.addToCart(product.value._id, quantity.value);
    emit('addToCart', { productId: product.value._id, quantity: quantity.value });
  } else {
    alert('Le produit n\'est plus en stock.');
  }
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