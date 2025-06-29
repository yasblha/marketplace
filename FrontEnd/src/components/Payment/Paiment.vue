<template>
  <div class="payment-section">
    <h2>Paiement</h2>
    
    <button @click="redirectToCheckout" :disabled="isProcessing">
      Payer {{ formatPrice(totalAmount) }}
    </button>
    
    <!-- Messages d'erreur -->
    <div v-if="error" class="error-message">{{ error }}</div>
    
    <!-- Overlay de chargement -->
    <div v-if="isProcessing" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from '@/services/api';
import { useCartStore } from '@/stores/panier';
import { useOrderStore } from '@/stores/Commande';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

const stripe = ref<any>(null);
const isProcessing = ref(false);
const error = ref('');
const totalAmount = ref(cartStore.calculateTotals().total);

// Charger Stripe
// Vérifier si l'utilisateur revient d'un paiement réussi
const checkReturnFromPayment = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  const paymentStatus = urlParams.get('payment_status');

  if (sessionId && paymentStatus === 'success') {
    // Vider le panier après un paiement réussi
    cartStore.clear();
    
    // Nettoyer l'URL
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
};

onMounted(async () => {
  // Vérifier le retour de paiement
  checkReturnFromPayment();
  
  try {
    const stripeLib = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    if (!stripeLib) throw new Error('Échec du chargement de Stripe');
    stripe.value = stripeLib;
  } catch (err) {
    console.error('Erreur Stripe:', err);
    error.value = 'Impossible de charger le système de paiement';
  }
});

const redirectToCheckout = async () => {
  isProcessing.value = true;
  error.value = '';

  try {
    // Créer une session de paiement côté serveur
    const response = await axiosInstance.post('/stripe/create-checkout-session', {
      items: cartStore.items.map(item => {
        const price = Number(item.price);
        if (isNaN(price) || price <= 0) {
          throw new Error(`Prix invalide pour l'article: ${item.name || 'sans nom'}`);
        }
        return {
          name: item.name || 'Article sans nom',
          price: price,
          quantity: Number(item.quantity) || 1,
          description: item.description || ''
        };
      }),
      customer: { email: 'client@example.com' } // Remplacer par l'email réel de l'utilisateur
    });

    // Utiliser Stripe.js pour la redirection
    const { sessionId } = response.data;
    if (!sessionId) throw new Error('Session Stripe non reçue');
    await stripe.value.redirectToCheckout({ sessionId });
  } catch (err: any) {
    console.error('Erreur lors de la création de la session de paiement:', err);
    error.value = err.response?.data?.error || 'Erreur lors du traitement du paiement';
    isProcessing.value = false;
  }
};

// Fonction pour créer une commande après un paiement réussi
const createOrder = async (paymentIntentId: string) => {
  try {
    // Logique pour créer une commande après un paiement réussi
    console.log('Création de la commande pour le paiement:', paymentIntentId);
    // Ici, vous pouvez appeler votre API pour enregistrer la commande
    // Exemple : await orderStore.createOrder({ paymentIntentId, items: cartStore.items });
    
    // Vider le panier après la commande
    // cartStore.clearCart();
    
    // Redirection vers la confirmation
    router.push({ name: 'OrderConfirmation', params: { id: paymentIntentId } });
  } catch (err) {
    console.error('Erreur lors de la création de la commande:', err);
    error.value = 'Erreur lors de la création de la commande';
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.payment-section {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

#card-element {
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #23a6f0;
  color: #f8f9fa;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #1d94d2;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 6px;
  text-align: center;
}
</style>
