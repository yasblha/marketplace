<template>
    <div class="checkout-page">
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
  
            <div v-if="selectedPaymentMethod === 'card'" class="payment-details">
              <label for="card-name">Cardholder Name</label>
              <input type="text" id="card-name" v-model="cardName" required />
  
              <label for="card-number">Card Number</label>
              <input type="text" id="card-number" v-model="cardNumber" required />
  
              <div class="card-details">
                <div>
                  <label for="card-expiry-month">Month</label>
                  <select id="card-expiry-month" v-model="cardExpiryMonth" required>
                    <option value="">Month</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
                <div>
                  <label for="card-expiry-year">Year</label>
                  <select id="card-expiry-year" v-model="cardExpiryYear" required>
                    <option value="">Year</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                  </select>
                </div>
                <div>
                  <label for="card-cvc">CVC</label>
                  <input type="text" id="card-cvc" v-model="cardCvc" required />
                </div>
              </div>
  
              <label class="save-card">
                <input type="checkbox" v-model="saveCard" /> Save card data for future payments
              </label>
  
              <div id="card-error" class="error-message"></div>
  
              <button type="submit" :disabled="loading">{{ loading ? 'Processing...' : 'Pay with card' }}</button>
            </div>
          </form>
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
const cardNumber = ref('');
const cardExpiryMonth = ref('');
const cardExpiryYear = ref('');
const cardCvc = ref('');
const saveCard = ref(false);
const loading = ref(false);

const selectPaymentMethod = (method: string) => {
  selectedPaymentMethod.value = method;
};

const handleSubmit = async () => {
  loading.value = true;

  try {
    const response = await axios.post('http://localhost:4242/create-checkout-session', {
      items: cartItems.value.map(item => ({
        id: item._id,
        quantity: item.quantity,
        name: item.name,
        price: item.price
      })),
      customer: {
        name: cardName.value,
        email: cardName.value // Assuming cardName is the email for now
      }
    });

    const { sessionId } = response.data;
    const stripe = await loadStripe('your-publishable-key');
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
  justify-content: center;
  width: 100%;
}

.checkout-form {
  width: 35%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  font-size: 1.2rem;
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
</style>
