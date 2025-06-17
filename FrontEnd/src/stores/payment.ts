

   // stores/payment.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js'
import axiosInstance from "@/services/api";
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '@/stores/panier';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');
   
   export const usePaymentStore = defineStore('payment', () => {
       const loading = ref(false);
       const error = ref('');
      const stripe = ref<Stripe | null>(null);
      const elements = ref<StripeElements | null>(null);
      const card = ref<StripeCardElement | null>(null);

      const cartStore = useCartStore();

        const cartItems = cartStore.items;
       
       const initializeStripe = async () => {
           stripe.value = await stripePromise;
           elements.value = stripe.value!.elements();
            card.value = elements.value!.create('card');
           card.value!.mount('#card-element');
       };
   
       const createPaymentIntent = async (amount: number, customerEmail: string) => {
           try {
               const response = await axiosInstance.post('/stripe/create-payment-intent', {
                   amount,
                   customer: { email: customerEmail || 'test@example.com' }
               });
               return response.data.clientSecret;
           } catch (err) {
               console.error('Error creating payment intent:', err);
               throw new Error('An error occurred. Please try again.');
           }
       };
   
        const handleCardPayment = async (cardName: string) => {
            loading.value = true;
            error.value = '';

        try {
                const items = cartItems.value;


                const amount = items.reduce((total: number, item: typeof cartItems.value[number]) => total + item.price * item.quantity, 0) * 100;

                const clientSecret = await createPaymentIntent(amount, cardName);

                const { error: stripeError, paymentIntent } = await stripe.value!.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: card.value!,
                        billing_details: { name: cardName }
                    }
                });

                if (stripeError) {
                    console.error(stripeError.message);
                    error.value = stripeError.message ?? '';
                } else {
                    console.log('Payment successful!', paymentIntent);
                    window.location.href = 'http://localhost:5173/paymentSuccess'; // Redirect to success page
                }
            } catch (err) {
                console.error('Error during card payment:', err);
                error.value = err instanceof Error ? err.message : String(err);
            } finally {
                loading.value = false;
            }
        };
   
        const handlePaypalCheckout = async (customerEmail: string) => {
            loading.value = true;
            error.value = '';
   
           try {
               const items = cartItems.value;
   
                const response = await axiosInstance.post('/stripe/create-checkout-session-paypal', {
                    items,
                    customer: { email: customerEmail || 'test@example.com' }
                });
   
                const { sessionId } = response.data;
                const { error } = await stripe.value!.redirectToCheckout({ sessionId });
   
                if (error) {
                    console.error('Error redirecting to Stripe Checkout:', error);
                    throw new Error('An error occurred. Please try again.');
                }
            } catch (err) {
                console.error('Error creating PayPal checkout session:', err);
                error.value = err instanceof Error ? err.message : String(err);
            } finally {
                loading.value = false;
            }
        };
   
       return {
           loading,
           error,
           initializeStripe,
           handleCardPayment,
           handlePaypalCheckout
       };
   });
