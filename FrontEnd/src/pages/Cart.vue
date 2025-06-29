<template>
  <section class="min-h-screen bg-slate-100 pb-28 px-4 md:px-8">
    <h1 class="text-3xl font-semibold py-6 text-center">Your cart</h1>

    <!-- cart wrapper -->
    <div class="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">
      <!-- products -->
      <div class="flex-1 bg-white rounded-xl shadow p-6">
        <p class="text-sm mb-5">
          Not ready to checkout?
          <RouterLink to="/" class="text-blue-600 underline">Continue shopping</RouterLink>
        </p>

        <div class="divide-y">
          <div
              v-for="p in items"
              :key="p._id"
              class="flex flex-col sm:flex-row gap-4 py-6"
          >
            <img :src="imageSrc(p)" :alt="p.name" class="w-28 h-28 object-cover rounded" />

            <div class="flex-1">
              <h2 class="font-medium text-lg">{{ p.name }}</h2>
              <p v-if="p.brand" class="text-sm text-slate-500">Brand: {{ p.brand }}</p>

              <!-- qty -->
              <div class="flex items-center gap-2 mt-2">
                <span class="text-sm">Qty:</span>
                <button
                    class="w-6 h-6 flex items-center justify-center border rounded"
                    @click="updateQty(p._id, p.quantity - 1)"
                >-</button>
                <span class="w-8 text-center">{{ p.quantity }}</span>
                <button
                    class="w-6 h-6 flex items-center justify-center border rounded"
                    @click="updateQty(p._id, p.quantity + 1)"
                >+</button>
              </div>
            </div>

            <div class="flex flex-col items-end justify-between">
              <p class="font-semibold text-lg">€{{ (+p.price).toFixed(2) }}</p>
              <button
                  class="text-sm underline text-red-600"
                  @click="remove(p._id)"
              >Remove</button>
            </div>
          </div>
        </div>
      </div>

      <!-- summary -->
      <aside class="w-full xl:w-80 bg-white rounded-xl shadow p-6">
        <h3 class="text-xl font-medium mb-4">Order summary</h3>

        <div class="space-y-4">
          <div
              v-for="info in orderInfos"
              :key="info.title"
              class="border rounded-lg p-3"
          >
            <details class="space-y-2">
              <summary class="cursor-pointer font-medium">{{ info.title }}</summary>
              <p class="text-sm text-slate-600">{{ info.description }}</p>
            </details>
          </div>
        </div>

        <div class="my-6 space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span class="font-medium">€{{ totals.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Shipping</span>
            <span class="text-slate-500">Calculated at next step</span>
          </div>
          <hr />
          <div class="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>€{{ totals.toFixed(2) }}</span>
          </div>
        </div>

        <button
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            @click="checkout"
            :disabled="isCheckingOut"
        >
          <span v-if="isCheckingOut" class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
          <span v-else>Continue to checkout</span>
        </button>
      </aside>
    </div>

    <!-- newsletter / footer -->
    <footer class="mt-16 space-y-10">
      <div class="bg-white rounded-xl shadow p-8 max-w-4xl mx-auto text-center">
        <h4 class="text-xl font-semibold mb-4">Sign up for our newsletter</h4>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <input
              type="email"
              placeholder="Email address"
              class="flex-1 border rounded px-4 py-2"
          />
          <button class="bg-slate-900 text-white px-6 py-2 rounded">Sign up</button>
        </div>
        <p class="text-sm text-slate-500 mt-4">
          Be the first to know about our special offers, news and updates.
        </p>
      </div>
      <p class="text-center text-xs text-slate-500">
        {{ new Date().getFullYear() }} site.com — All rights reserved
      </p>
    </footer>

    <!-- cart error modal -->
    <Modal v-model="showError" :title="errorTitle">
      <p class="mb-6">{{ errorMessage }}</p>
      <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          @click="showError = false"
      >
        OK
      </button>
    </Modal>

    <Footer />
  </section>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter }                from 'vue-router'
import { useCartStore }             from '@/stores/panier'
import { useOrderStore }            from '@/stores/Commande'
import { useAuthStore }             from '@/stores/user'
import { OrderStatus }              from '@/types/orderStatus'
// @ts-ignore
import defaultImage from '@/assets/ui_assets/NoImage.jpg'
import Modal                        from '@/components/common/Modale.vue'
import Footer                       from '@/components/UI/Footer.vue'

const cart        = useCartStore()
const orderStore  = useOrderStore()
const auth        = useAuthStore()
const router      = useRouter()
const showError   = ref(false)
const errorTitle  = ref('Cart Error')
const errorMessage = ref('An error occurred with your cart.')
const isCheckingOut = ref(false)

const orderInfos = [
  {
    title: 'Return Policy',
    description:
        'This is our example return policy which is everything you need to know about our returns.'
  },
  {
    title: 'Shipping Options',
    description: 'Various shipping options are available for your convenience.'
  }
] as const

/** ───── getters ─────────────────────────────────────────────── */
const items   = computed(() => cart.items)
const totals  = cart.totals // computed<number>

/** ───── helpers ─────────────────────────────────────────────── */
const backendUrl = import.meta.env.VITE_APP_API_URL?.replace(/\/+$/, '') || ''

const imageSrc = (p: { images?: string[] }): string => {
  if (!p.images?.length) return defaultImage
  const src = p.images[0]
  if (/^https?:\/\//i.test(src)) return src // déjà absolu
  return `${backendUrl}/${src.replace(/^\/+/, '')}`
}

/** ───── actions ─────────────────────────────────────────────── */
const updateQty = (id: string, q: number) => cart.setQty(id, q)
const remove    = (id: string)            => cart.remove(id)

const checkout = async () => {
  if (!items.value.length) {
    errorTitle.value = 'Empty Cart'
    errorMessage.value = 'Your cart is empty. Add products before checking out.'
    showError.value = true
    return
  }
  if (isCheckingOut.value) return
  isCheckingOut.value = true
  try {
    await cart.saveSnapshot()
    const orderId = await orderStore.createOrder({
      statusOrder : OrderStatus.Pending,
      totalAmount : totals,
      products    : items.value.map(i => ({
        productId: typeof i._id === 'string' && i._id.startsWith('pg_') ? i._id.slice(3) : String(i._id),
        quantity : i.quantity
      }))
    })

    if (!orderId) {
      throw new Error('Failed to create order')
    }

    localStorage.setItem('currentOrderId', String(orderId))
    await cart.clear()
    router.push({ name: 'Checkout', query: { orderId } })
  } catch (e:any) {
    console.error('checkout error', e)

    // Set appropriate error message
    errorTitle.value = 'Checkout Error'
    errorMessage.value = e.message || 'Unexpected checkout error'
    showError.value = true
    cart.restoreSnapshot()
  } finally {
    isCheckingOut.value = false
  }
}

onMounted(() => cart.syncWithBackend())
</script>

<style scoped>
/* plus aucun CSS verbeux : tout le style est géré par Tailwind */
</style>
