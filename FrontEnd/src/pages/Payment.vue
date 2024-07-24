<template>
    <div class="checkout-page">
      <div class="titles">
        <h2>Your checkout</h2>
        <span>Not ready to checkout? Continue Shopping</span>
      </div>
      <section class="checkout-container">
        <div class="checkout-form">
          <div class="steps">
            <span>Address</span>
            <span>Shipping</span>
            <span class="active-step">Payment</span>
          </div>
  
          <div class="payment-methods">
            <button type="button" @click="selectPaymentMethod('paypal')" :class="{ active: selectedPaymentMethod === 'paypal' }">PayPal</button>
            <button type="button" @click="selectPaymentMethod('card')" :class="{ active: selectedPaymentMethod === 'card' }">Credit Card</button>
          </div>
  
          <form @submit.prevent="selectedPaymentMethod === 'card' ? handleSubmit() : handlePaypalCheckout()">
            <div v-if="selectedPaymentMethod === 'card'" class="payment-details">
              <label for="card-name">Cardholder Name</label>
              <input type="text" id="card-name" v-model="cardName" required />
  
              <label for="card-element">Card Details</label>
              <div id="card-element">
                <!-- Stripe Card Element will be inserted here -->
              </div>
  
              <label class="save-card">
                <input type="checkbox" v-model="saveCard" /> Save card data for future payments
              </label>
  
              <div id="card-error" class="error-message">{{ error }}</div>
  
              <button type="submit" :disabled="loading">{{ loading ? 'Processing...' : 'Pay with card' }}</button>
            </div>
  
            <button v-if="selectedPaymentMethod === 'paypal'" type="submit" :disabled="loading">{{ loading ? 'Processing...' : 'Pay with PayPal' }}</button>
          </form>
        </div>
  
        <div class="cart-summary">
          <h3>Your cart</h3>
          <div v-for="item in cartItems" :key="item.Id" class="cart-item">
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p>Size: {{ item.size }}</p>
              <p>Quantity: {{ item.quantity }}</p>
              <p>${{ item.price }}</p>
              <button @click="removeItem(item.Id)">Remove</button>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
  </template>
  
  
  
  
  
  
  
  <script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { loadStripe } from '@stripe/stripe-js';
import Footer from "../components/UI/Footer.vue";
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51MzKwrI4CWQS7W9jUqGbkjMfywCGLlu3ssgCbslIKp31FYWHiOrDnZmuUK1QNOMZ35v1QgR3dB1FkoRhWjwbprii00vdSRgTX6'); // Remplacez par votre clé publique

const cartStore = useCartStore();
const cartItems = computed(() => cartStore.cartItems);

const selectedPaymentMethod = ref('card');
const cardName = ref('');
const saveCard = ref(false);
const loading = ref(false);
const error = ref('');

const selectPaymentMethod = (method: string) => {
  selectedPaymentMethod.value = method;
};

let stripe;
let elements;
let card;

onMounted(async () => {
  stripe = await stripePromise;
  elements = stripe.elements();
  card = elements.create('card');
  card.mount('#card-element');
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  // Vérifier si cartItems.value est défini et n'est pas vide, sinon utiliser des données mockées
  const items = (cartItems.value && cartItems.value.length > 0) ? cartItems.value : [
    {
      Id: 'mock1',
      name: 'Test Product',
      quantity: 1,
      price: 10,
    }
  ];

  if (!stripe || !elements || !card) {
    console.error('Stripe has not been initialized.');
    loading.value = false;
    return;
  }

  try {
    const amount = items.reduce((total, item) => total + item.price * item.quantity, 0) * 100;

    console.log('Amount to be charged:', amount);

    const response = await axios.post('http://localhost:3000/api/stripe/create-payment-intent', {
      amount: amount,
      customer: {
        email: cardName.value || 'test@example.com' // Utiliser un email de test si aucun email n'est fourni
      }
    });

    const clientSecret = response.data.clientSecret;
    console.log('Client secret received:', clientSecret); // Log the client secret

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: cardName.value
        }
      }
    });

    if (stripeError) {
      console.error(stripeError.message);
      error.value = stripeError.message;
    } else {
      console.log('Payment successful!', paymentIntent);
      // Redirect or display a success message
    }
  } catch (err) {
    console.error('Error creating payment intent:', err);
    error.value = 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handlePaypalCheckout = async () => {
  loading.value = true;

  // Vérifier si cartItems.value est défini et n'est pas vide, sinon utiliser des données mockées
  const items = (cartItems.value && cartItems.value.length > 0) ? cartItems.value : [
    {
      Id: 'mock1',
      name: 'Test Product',
      quantity: 1,
      price: 10,
    }
  ];

  try {
    const response = await axios.post('http://localhost:3000/api/stripe/create-paypal-checkout-session', {
      items: items,
      customer: {
        email: cardName.value || 'test@example.com' // Utiliser un email de test si aucun email n'est fourni
      }
    });

    const { sessionId } = response.data;
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Error redirecting to Stripe Checkout:', error);
    }
  } catch (err) {
    console.error('Error creating PayPal checkout session:', err);
    error.value = 'An error occurred. Please try again.';
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
    width: 60%;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-right: 20px;

  }
  
  .steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    font-size: 1.2rem;
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
  
  .card-details > div {
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
  