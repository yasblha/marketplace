<template>

  <div class="checkout">
    <div class="titles">
      <h2>Your checkout</h2>
      <span>Not ready to checkout? Continue Shopping</span>
    </div>
  </div>
  <div class="checkout-page">


    <section class="checkout-container">
      <div class="checkout-form">
        <div class="steps">
          <span>Address</span>
          <hr>
          <span>Shipping</span>
          <hr>
          <span class="active-step">Payment</span>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="payment-methods">
            <button type="button" @click="selectPaymentMethod('paypal')"
              :class="{ active: selectedPaymentMethod === 'paypal' }">PayPal</button>
            <button type="button" @click="selectPaymentMethod('card')"
              :class="{ active: selectedPaymentMethod === 'card' }">Credit Card</button>
          </div>

          <div v-if="selectedPaymentMethod === 'card'" class="payment-details">
            <label for="card-name">Email</label>
            <input type="text" id="card-name" v-model="cardName" required />

            <label class="save-card">
              <input type="checkbox" v-model="saveCard" /> Save card data for future payments
            </label>

            <div id="card-error" class="error-message"></div>
          </div>
          <button type="submit" :disabled="loading">{{ loading ? 'Processing...' : 'Pay with card' }}</button>
        </form>
      </div>

      <div class="cart-summary">
        <h3>Your cart</h3>
        <div v-for="item in cartItems" :key="item._id" class="cart-item">
          <div class="item-details">
            <h4>{{ item.name }}</h4>
            <p>Size: {{ item.size }}</p>
            <p>Quantity: {{ item.quantity }}</p>
            <p>${{ item.price }}</p>
            <button @click="removeItem(item._id)">Remove</button>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Footer />
</template>



<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { loadStripe } from '@stripe/stripe-js';
import Footer from "../components/UI/Footer.vue";
import axios from 'axios';

const cartStore = useCartStore();
const cartItems = computed(() => cartStore.cartItems);

const selectedPaymentMethod = ref('card');
const cardName = ref('');
const saveCard = ref(false);
const loading = ref(false);

const selectPaymentMethod = (method: string) => {
  selectedPaymentMethod.value = method;
};

const handleSubmit = async () => {
  loading.value = true;

  // Vérifier si cartItems.value est défini et n'est pas vide, sinon utiliser des données mockées
  const items = (cartItems.value && cartItems.value.length > 0) ? cartItems.value : [
    {
      _id: 'mock1',
      name: 'Test Product',
      quantity: 1,
      price: 10,
    }
  ];

  try {
    const response = await axios.post('http://localhost:3000/api/stripe/create-checkout-session', {
      items: items.map(item => ({
        id: item._id,
        quantity: item.quantity,
        name: item.name,
        price: item.price
      })),
      customer: {
        email: cardName.value || 'test@example.com' // Utiliser un email de test si aucun email n'est fourni
      }
    });

    const { sessionId } = response.data;
    const stripe = await loadStripe('pk_test_51MzKwrI4CWQS7W9jUqGbkjMfywCGLlu3ssgCbslIKp31FYWHiOrDnZmuUK1QNOMZ35v1QgR3dB1FkoRhWjwbprii00vdSRgTX6');
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Error redirecting to Stripe Checkout:', error);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
  } finally {
    loading.value = false;
  }
};

const removeItem = (itemId: string) => {
  cartStore.removeFromCart(itemId);
};
</script>

<style scoped>
.checkout-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.checkout-container {
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.checkout-form {
  width: 56%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
  font-size: 14px
  ;

}

.steps hr {

  /* border: none;
  height: 2px;
  background-color: black;
  margin: 20px 0; */
}

.checkout{
  position: relative;
  top: 5px;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  font-size: 17px;
}

.steps .active-step {
  font-weight: bold;
}

.payment-methods {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.payment-methods button {
  margin: 0 10px;
  padding: 10px 20px;
  border: 1px solid #ccc;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: black;
}

.payment-methods .active {
  background-color: #000;
  color: #fff;
}

.payment-details label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.payment-details input,
.payment-details select {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.card-details {
  display: flex;
  justify-content: space-between;
}

.card-details>div {
  width: 32%;
}

.save-card {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.save-card input {
  margin-right: 0.5rem;
}

.error-message {
  color: red;
  margin-bottom: 1rem;
}

button {
  padding: 10px 20px;
  border: none;
  background-color: #000;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 4px;
  width: 100%;
}

button:disabled {
  background-color: #ccc;
}

.cart-summary {
  width: 35%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: flex;
  margin-bottom: 1rem;
}

.cart-item img {
  width: 50px;
  height: 50px;
  margin-right: 1rem;
}

.item-details {
  display: flex;
  flex-direction: column;
}
</style>