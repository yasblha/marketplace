
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
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            @click="checkout"
        >
          Continue to checkout
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
        © {{ new Date().getFullYear() }} site.com — All rights reserved
      </p>
    </footer>

    <!-- empty-cart modal -->
    <Modal v-model="showError" title="Empty cart">
      <p class="mb-6">Your cart is empty. Add products before checking out.</p>
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
import defaultImage                 from '@/assets/No_Image_Available .jpg'
import Modal                        from '@/components/common/Modale.vue'
import Footer                       from '@/components/UI/Footer.vue'

const cart        = useCartStore()
const orderStore  = useOrderStore()
const router      = useRouter()
const showError   = ref(false)

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
const totals  = computed(() => cart.totals) // {totalQty, totals}

/** ───── helpers ─────────────────────────────────────────────── */
const backendUrl = import.meta.env.VITE_APP_API_URL?.replace(/\/+$/, '') || ''

const imageSrc = (p: { images?: string[] }): string =>
    p.images?.length
        ? `${backendUrl}/${String(p.images[0]).replace(/^\/+/, '')}`
        : defaultImage

/** ───── actions ─────────────────────────────────────────────── */
const updateQty = (id: string, q: number) => cart.setQty(id, q)
const remove    = (id: string)            => cart.remove(id)

const checkout  = async () => {
  if (!items.value.length) {
    showError.value = true
    return
  }

  try {
    const orderId = await orderStore.createOrder({
      userId      : cart.isAuthenticated ? cart.auth.user.id : null,
      statusOrder : 'Pending Validation',
      totalAmount : totals.value,
      products    : items.value.map(i => ({ productId: i._id, quantity: i.quantity }))
    })

    localStorage.setItem('currentOrderId', orderId)
    await cart.clear()
    router.push({ name: 'checkout', query: { orderId } })
  } catch (e) {
    console.error('checkout error', e)
  }
}

onMounted(cart.loadRemote)
</script>

<style scoped>
/* plus aucun CSS verbeux : tout le style est géré par Tailwind */
</style>
