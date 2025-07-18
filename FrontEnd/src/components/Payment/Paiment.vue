<template>
  <div class="payment-section">
    <h2>Paiement</h2>

    <button
        @click="redirectToCheckout"
        :disabled="isProcessing || !hasPayableItems"
    >
      Payer {{ formatPrice(totalAmount) }}
    </button>

    <p v-if="!hasPayableItems" class="text-sm text-gray-500 mt-2">
      Aucun article à payer.
    </p>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="isProcessing" class="loading-overlay">
      <div class="spinner"></div>
      <p class="mt-2">Redirection vers Stripe…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import axios from '@/services/api'
import { useCartStore } from '@/stores/panier'
import { useOrderStore } from '@/stores/Commande'
import { useRoute } from 'vue-router'

const cartStore  = useCartStore()
const orderStore = useOrderStore()
const route      = useRoute()

const stripe       = ref<any>(null)
const isProcessing = ref(false)
const error        = ref('')
const currentOrder = ref<any>(null)

const loadLocalItems = () =>
    cartStore.getCartItems().map(i => ({
      name : i.name,
      price: +i.price,
      qty  : i.quantity
    }))

const sourceItems = computed(() => {
  if (currentOrder.value?.OrderDetails?.length) {
    return currentOrder.value.OrderDetails.map((d: any) => ({
      name : d.productName,
      price: +d.unitPrice,
      qty  : d.quantity
    }))
  }
  return loadLocalItems()
})

const hasPayableItems = computed(() =>
    sourceItems.value.some(i => i.qty > 0 && i.price > 0)
)

const totalAmount = computed(() =>
    sourceItems.value.reduce((s, i) => s + i.price * i.qty, 0)
)

onMounted(async () => {
  if (!cartStore.items.length) {
    await cartStore.syncWithBackend()
    if (!cartStore.items.length) cartStore.restoreSnapshot()
  }

  const orderId = route.query.orderId
  if (orderId) {
    currentOrder.value = await orderStore.fetchOrderById(Number(orderId))
    if (!currentOrder.value) error.value = 'Commande introuvable.'
  }

  stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  if (!stripe.value) error.value = 'Stripe non initialisé'
})

const redirectToCheckout = async () => {
  if (!hasPayableItems.value) return

  isProcessing.value = true
  error.value = ''

  try {
    const items = sourceItems.value.map(i => ({
      name: i.name,
      price: i.price,
      quantity: i.qty
    }))

    const { data } = await axios.post('/stripe/create-checkout-session', {
      items,
      customer: { email: 'client@example.com' }
    })

    await stripe.value.redirectToCheckout({ sessionId: data.sessionId })
  } catch (e: any) {
    error.value = e?.response?.data?.error || 'Erreur lors du paiement'
    isProcessing.value = false
  }
}

const formatPrice = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
</script>

<style scoped>
.loading-overlay{position:fixed;inset:0;background:rgba(255,255,255,.8);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:1000}
.spinner{width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.payment-section{max-width:600px;margin:2rem auto;padding:2rem;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.1)}
button{width:100%;padding:1rem;background:#23a6f0;color:#fff;border:none;border-radius:6px;font-size:1.1rem;font-weight:500;cursor:pointer;transition:background .3s}
button:hover:not(:disabled){background:#1d94d2}
button:disabled{background:#ccc;cursor:not-allowed}
.error-message{margin-top:1rem;padding:1rem;background:#f8d7da;color:#721c24;border-radius:6px;text-align:center}
</style>
