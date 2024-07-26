<template>
  <section class="payment">
    <div class="container">
      <h2>Payment</h2>
      <form @submit.prevent="completePurchase">
        <div class="form-row">
          <div class="form-group">
            <label for="firstname">First Name</label>
            <input type="text" id="firstname" v-model="billingDetails.firstname" required />
          </div>
          <div class="form-group">
            <label for="lastname">Last Name</label>
            <input type="text" id="lastname" v-model="billingDetails.lastname" required />
          </div>
        </div>
        <div class="form-group">
          <label for="card-element">Card</label>
          <div id="card-element" ref="cardElement"></div>
        </div>
        <button type="submit" :disabled="processing">
          <span v-if="processing">Processing...</span>
          <span v-else>Complete Purchase</span>
        </button>
      </form>
      <div v-if="processing" class="loading">Processing your payment, please wait...</div>
      <div v-if="showSuccess" class="success-popup">Payment Successful!</div>
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="order-line-item">
          <span>Subtotal:</span>
          <span>{{ formatCurrency(cartStore.calculateTotals().subtotal) }}</span>
        </div>
        <div class="order-line-item">
          <span>Shipping:</span>
          <span v-if="shippingMethod === 'standard'">{{ formatCurrency(500) }}</span>
          <span v-if="shippingMethod === 'express'">{{ formatCurrency(1500) }}</span>
          <span v-if="shippingMethod === 'overnight'">{{ formatCurrency(2500) }}</span>
        </div>
        <div class="order-line-item">
          <span>Total:</span>
          <span>{{ formatCurrency(calculateTotalAmount()) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '@/stores/panier';
import { useOrderStore } from '@/stores/Commande';

const stripePk = import.meta.env.VITE_STRIPE_PK;
if (!stripePk) {
  throw new Error("Stripe public key is not defined");
}

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();
const shippingMethod = ref(localStorage.getItem('shippingMethod') || 'standard');
const processing = ref(false);
const showSuccess = ref(false);
let stripe: any;
let elements: any;
let card: any;

const billingDetails = ref({
  firstname: '',
  lastname: ''
});

const setupStripe = async () => {
  stripe = await loadStripe(stripePk);
  elements = stripe.elements();
  card = elements.create('card', {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  });
  card.mount('#card-element');
};

onMounted(() => {
  setupStripe();
});

const completePurchase = async () => {
  processing.value = true;
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: card,
    billing_details: {
      name: `${billingDetails.value.firstname} ${billingDetails.value.lastname}`
    },
  });

  if (error) {
    console.error('Error creating payment method:', error);
    processing.value = false;
    return;
  }

  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/stripe/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentMethodId: paymentMethod.id,
      amount: calculateTotalAmount() * 100, // Amount in cents
    }),
  });

  const result = await response.json();

  if (result.error) {
    console.error('Error confirming payment:', result.error);
    processing.value = false;
    return;
  }

  if (result.requiresAction) {
    const { error: confirmError } = await stripe.confirmCardPayment(result.clientSecret);
    if (confirmError) {
      console.error('Error confirming card payment:', confirmError);
      processing.value = false;
      return;
    }
  }

  // Update order status to 'paid'
  const orderId = router.currentRoute.value.query.orderId;
  if (orderId) {
    await orderStore.updateOrder(orderId, { statusOrder: 'paid' });
  }

  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
    localStorage.removeItem('shippingInfo');
    localStorage.removeItem('shippingMethod');
    cartStore.clearCart();
    router.push('/');
  }, 2000);

  processing.value = false;
};

const calculateTotalAmount = () => {
  const subtotal = cartStore.calculateTotals().subtotal;
  switch (shippingMethod.value) {
    case 'express':
      return subtotal + 15;
    case 'overnight':
      return subtotal + 25;
    default:
      return subtotal + 5;
  }
};

const formatCurrency = (amount) => {
  return (amount / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
};
</script>

<style scoped>
.payment {
  padding: 20px;
  background-color: #f9f9f9;
}

.container {
  max-width: 600px;
  width: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  color: #333;
}

.order-summary {
  margin-top: 20px;
}

.order-summary h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.order-line-item {
  display: flex;
  justify-content: space-between;
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 5px;
}

.form-row {
  display: flex;
  justify-content: space-between;
}

.form-group {
  margin-bottom: 15px;
  flex: 1;
  margin-right: 10px;
}

.form-group:last-child {
  margin-right: 0;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
}

#card-element {
  background-color: #fff;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #218838;
}

.loading {
  margin-top: 20px;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  color: #333;
}

.success-popup {
  margin-top: 20px;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  color: #28a745;
}
</style>
