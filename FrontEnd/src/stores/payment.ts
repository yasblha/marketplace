import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js'
import axiosInstance from '@/services/api'
import { useCartStore } from '@/stores/panier'
import router from '@/router/router'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')

export const usePaymentStore = defineStore('payment', () => {
    const loading  = ref(false)
    const error    = ref('')
    const stripe   = ref<Stripe | null>(null)
    const elements = ref<StripeElements | null>(null)
    const card     = ref<StripeCardElement | null>(null)

    const cartStore  = useCartStore()
    const cartItems  = computed(() => cartStore.items)
    const totalCents = computed(() =>
        cartItems.value.reduce((s, i) => s + Math.round(Number(i.price) * 100) * i.quantity, 0)
    )

    const initializeStripe = async () => {
        stripe.value   = await stripePromise
        if (!stripe.value) {
            error.value = 'Stripe non initialisé'
            return
        }
        elements.value = stripe.value.elements()
        card.value     = elements.value.create('card')
        card.value.mount('#card-element')
    }

    const createPaymentIntent = async (amount: number, email: string) => {
        const { data } = await axiosInstance.post('/stripe/create-payment-intent', {
            amount,
            customer: { email }
        })
        return data.clientSecret as string
    }

    const handleCardPayment = async (payerName: string, payerEmail: string) => {
        if (!totalCents.value) {
            error.value = 'Montant invalide'
            return
        }
        loading.value = true
        error.value   = ''
        try {
            const clientSecret = await createPaymentIntent(totalCents.value, payerEmail)
            const { error: se } = await stripe.value!.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card.value!,
                    billing_details: { name: payerName, email: payerEmail }
                }
            })
            if (se) {
                error.value = se.message ?? ''
            } else {
                await cartStore.clear()
                router.push('/paymentSuccess')
            }
        } catch (e: any) {
            error.value = e?.message ?? 'Erreur paiement'
        } finally {
            loading.value = false
        }
    }

    const handlePaypalCheckout = async (email: string) => {
        if (!cartItems.value.length) {
            error.value = 'Panier vide'
            return
        }
        loading.value = true
        error.value   = ''
        try {
            const items = cartItems.value.map(i => ({
                name: i.name,
                price: Number(i.price),
                quantity: i.quantity
            }))
            const { data } = await axiosInstance.post('/stripe/create-checkout-session-paypal', {
                items,
                customer: { email }
            })
            const { error: se } = await stripe.value!.redirectToCheckout({ sessionId: data.sessionId })
            if (se) error.value = se.message ?? ''
        } catch (e: any) {
            error.value = e?.message ?? 'Erreur paiement'
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        initializeStripe,
        handleCardPayment,
        handlePaypalCheckout
    }
})
