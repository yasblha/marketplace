import { ref, computed, onBeforeUnmount } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '@/services/api'
import { useAuthStore } from '@/stores/user'
import { useProductStore } from '@/stores/products'
import type { Product } from '@/types/product'

type CartItem = Product & { _id: string; quantity: number; reservedUntil?: string }

const lsKey = 'cartItems'
const now = () => new Date().toISOString()

export const useCartStore = defineStore('cart', () => {
    const auth   = useAuthStore()
    const prod   = useProductStore()

    const items      = ref<CartItem[]>(JSON.parse(localStorage.getItem(lsKey) || '[]'))
    const loading    = ref(false)
    const error      = ref<string | null>(null)
    const isAuth     = computed(() => auth.isAuthenticated)
    const totalQty   = computed(() => items.value.reduce((n, i) => n + i.quantity, 0))
    const totals     = computed(() => items.value.reduce((t, i) => t + +i.price * i.quantity, 0))

    const persist = () => localStorage.setItem(lsKey, JSON.stringify(items.value))

    const syncAdd = async (id: string, q: number) => {
        if (!isAuth.value) return
        try {
            const { data } = await axiosInstance.post('/cart', {
                productid: id,
                userid: auth.user!.id,
                quantity: q
            })
            const itm = items.value.find(i => i._id === id)
            if (itm && data?.reservedUntil) itm.reservedUntil = data.reservedUntil
        } catch (e) { /* silent */ }
    }

    const syncUpdate = async (id: string, q: number) => {
        if (!isAuth.value) return
        try {
            await axiosInstance.put(`/cart/${id}`, {
                userid: auth.user!.id,
                productid: id,
                quantity: q
            })
        } catch (e) { /* silent */ }
    }

    const syncDelete = async (id: string) => {
        if (!isAuth.value) return
        try { await axiosInstance.delete(`/cart/${id}`) } catch (e) { /* silent */ }
    }

    const add = async (p: Product, q = 1) => {
        if (q < 1) return
        loading.value = true
        try {
            const id = String(p._id ?? p.id)
            const existing = items.value.find(i => i._id === id)
            if (existing) existing.quantity += q
            else items.value.push({ ...p, _id: id, quantity: q })
            persist()
            await syncAdd(id, q)
        } catch (e: any) {
            error.value = e.message || 'add error'
            throw e
        } finally { loading.value = false }
    }

    const setQty = async (id: string, q: number) => {
        if (q < 1) return remove(id)
        loading.value = true
        try {
            const it = items.value.find(i => i._id === id)
            if (!it) return
            it.quantity = q
            persist()
            await syncUpdate(id, q)
        } finally { loading.value = false }
    }

    const remove = async (id: string) => {
        loading.value = true
        try {
            items.value = items.value.filter(i => i._id !== id)
            persist()
            await syncDelete(id)
        } finally { loading.value = false }
    }

    const clear = async () => {
        loading.value = true
        try {
            if (isAuth.value) await axiosInstance.delete('/cart/clear', { params: { userid: auth.user!.id } })
            items.value = []
            persist()
        } finally { loading.value = false }
    }

    const loadRemote = async () => {
        if (!isAuth.value) return
        loading.value = true
        try {
            const { data } = await axiosInstance.get(`/cart/${auth.user!.id}`)
            const list = Array.isArray(data) ? data : []
            const fresh: CartItem[] = []
            for (const row of list) {
                const id = String(row.product?._id ?? row.productid)
                const p  = await prod.getProductById(id)
                if (p) fresh.push({ ...p, _id: id, quantity: row.quantity, reservedUntil: row.reservedUntil })
            }
            items.value = fresh
            persist()
        } finally { loading.value = false }
    }

    const purgeExpired = () => {
        const t = new Date()
        items.value = items.value.filter(i => !i.reservedUntil || new Date(i.reservedUntil) > t)
        persist()
    }

    const timer = setInterval(purgeExpired, 60_000)
    window.addEventListener('beforeunload', persist)
    onBeforeUnmount(() => { clearInterval(timer); window.removeEventListener('beforeunload', persist) })

    return {
        items,
        loading,
        error,
        totalQty,
        totals,
        add,
        setQty,
        remove,
        clear,
        loadRemote
    }
})
