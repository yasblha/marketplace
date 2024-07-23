<template>
    <div class="checkout-page">
      <NavigationBar />
  
      <section class="checkout-container">
        <div class="checkout-form">
          <h2>Checkout</h2>
          <div class="steps">
            <span>Address</span>
            <span>Shipping</span>
            <span>Payment</span>
          </div>
  
          <form @submit.prevent="handleSubmit">
            <div class="payment-methods">
              <button type="button" @click="selectPaymentMethod('paypal')" :class="{ active: selectedPaymentMethod === 'paypal' }">PayPal</button>
              <button type="button" @click="selectPaymentMethod('card')" :class="{ active: selectedPaymentMethod === 'card' }">Credit Card</button>
            </div>
  
            <div v-if="selectedPaymentMethod === 'card'">
              <label for="email">Email</label>
              <input type="email" v-model="email" required />
  
              <label for="card-number">Card Number</label>
              <div id="card-number"></div>
  
              <label for="card-expiry">Card Expiry</label>
              <div id="card-expiry"></div>
  
              <label for="card-cvc">Card CVC</label>
              <div id="card-cvc"></div>
  
              <div id="card-error"></div>
  
              <button type="submit" :disabled="loading">{{ loading ? 'Processing...' : 'Pay Now' }}</button>
            </div>
          </form>
        </div>
  
        <div class="cart-summary">
          <h3>Your cart</h3>
          <div v-for="item in cartItems" :key="item._id" class="cart-item">
            <!-- <img :src="item.images" alt="Product image" /> -->
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p>Quantity: {{ item.quantity }}</p>
              <p>${{ item.price }}</p>
              <button @click="removeItem(item._id)">Remove</button>
            </div>
          </div>
        </div>
      </section>
  
      <Footer />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useCartStore } from '@/stores/cart';
  import NavigationBar from "../components/UI/NavigationBar.vue";
  import Footer from "../components/UI/Footer.vue";
  import axios from 'axios';
  import { loadStripe, Stripe, StripeElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/stripe-js';
  
  const cartStore = useCartStore();
  const cartItems = computed(() => cartStore.cartItems);
  
  const selectedPaymentMethod = ref('card');
  const email = ref('');
  const loading = ref(false);
  
  let stripe: Stripe | null = null;
  let elements: StripeElements | null = null;
  let cardNumber: CardNumberElement | null = null;
  let cardExpiry: CardExpiryElement | null = null;
  let cardCvc: CardCvcElement | null = null;
  
  const style = {
    base: {
      color: 'black',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '14px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  };
  
  onMounted(async () => {
    stripe = await loadStripe('your-publishable-key');
    if (stripe) {
      elements = stripe.elements();
      cardNumber = elements.create('cardNumber', { style });
      cardNumber.mount('#card-number');
  
      cardExpiry = elements.create('cardExpiry', { style });
      cardExpiry.mount('#card-expiry');
  
      cardCvc = elements.create('cardCvc', { style });
      cardCvc.mount('#card-cvc');
    }
  });
  
  onBeforeUnmount(() => {
    if (cardNumber) cardNumber.destroy();
    if (cardExpiry) cardExpiry.destroy();
    if (cardCvc) cardCvc.destroy();
  });
  
  const selectPaymentMethod = (method: string) => {
    selectedPaymentMethod.value = method;
  };
  
  const handleSubmit = async () => {
    loading.value = true;
  
    try {
      const response = await axios.post('http://localhost:4242/create-payment-intent', {
        items: cartItems.value.map(item => ({
          id: item._id,
          quantity: item.quantity,
          name: item.name,
          price: item.price
        })),
        email: email.value,
      });
  
      const { clientSecret } = response.data;
  
      if (!stripe || !elements || !cardNumber) {
        console.error('Stripe has not been initialized.');
        return;
      }
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            email: email.value,
          },
        },
      });
  
      if (result.error) {
        document.getElementById('card-error')!.innerText = result.error.message!;
        console.error("Payment failed:", result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          console.log("Payment succeeded!");
          window.location.href = "/success";
        }
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
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
    flex-direction: column;
    align-items: center;
  }
  
  .checkout-container {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin-top: 2rem;
  }
  
  .checkout-form {
    width: 60%;
  }
  
  .steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
  
  .payment-methods {
    display: flex;
    margin-bottom: 2rem;
  }
  
  .payment-methods button {
    margin-right: 1rem;
  }
  
  .payment-methods .active {
    background-color: #000;
    color: #fff;
  }
  
  .cart-summary {
    width: 35%;
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
  
  #custom-button {
    height: 30px;
    outline: 1px solid grey;
    background-color: green;
    padding: 5px;
    color: white;
  }
  
  #card-error {
    color: red;
  }
  </style>
  