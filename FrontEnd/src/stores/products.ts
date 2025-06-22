import { ref } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '@/services/api'
import { useAuthStore } from '@/stores/user'
import type { Product, SearchCriteria, ProductForm } from '@/types/product'
import defaultImage from '@/assets/No_Image_Available .jpg'

const extractImagePath = (raw: any): string => {
    if (!raw) return ''
    if (Array.isArray(raw)) return extractImagePath(raw[0])

    let src = typeof raw === 'string' ? raw : raw.url ?? raw.path ?? ''
    const match = src.match(/uploads\/[^"}\]]+/)
    if (match) src = match[0]

    src = src.replace(/^\/+/, '')
    if (/^https?:\/\//i.test(src)) return src
    if (!src.startsWith('uploads/')) src = `uploads/${src}`
    return `/${src}`
}

const normalizeProduct = (p: any): Product => {
    const images = (Array.isArray(p.images) ? p.images : [p.image])
        .map(extractImagePath)
        .filter(Boolean)

    return {
        ...p,
        images: images.length ? images : [defaultImage],
        image: images[0] ?? defaultImage
    } as Product
}

export const useProductStore = defineStore('product', () => {
    const products = ref<Product[]>([])
    const authStore = useAuthStore()

    const fetchProducts = async (): Promise<void> => {
        const { data } = await axiosInstance.get('/products')
        const { mongoProducts = [], sqlProducts = [] } = data
        const pgMap = new Map(sqlProducts.map((p: any) => [String(p.id ?? p._id), p]))

        products.value = mongoProducts.map((m: any) => {
            const id = String(m.id ?? m._id)
            const pg = pgMap.get(id)
            return normalizeProduct({ ...pg, ...m })
        })
    }

    const getProductById = async (id: string) => {
        const { data } = await axiosInstance.get(`/products/${id}`)
        return normalizeProduct(data)
    }

    const createProduct = async (payload: FormData | ProductForm) => {
        const { data } = await axiosInstance.post('/products', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${authStore.token}`
            }
        })
        if (data?.product?.newSQLProduct)
            products.value.push(normalizeProduct(data.product.newSQLProduct))
    }

    const uploadProductImages = (fd: FormData) =>
        axiosInstance.post('/upload/upload', fd, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${authStore.token}`
            }
        })

    const updateProduct = async (
        id: string,
        payload: FormData | Partial<ProductForm>
    ) => {
        const { data } = await axiosInstance.put(`/products/${id}`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${authStore.token}`
            }
        })
        const idx = products.value.findIndex(p => String(p._id ?? p.id) === id)
        if (idx !== -1 && data?.product?.updatedSQLProduct)
            products.value[idx] = normalizeProduct({
                ...products.value[idx],
                ...data.product.updatedSQLProduct
            })
    }

    const deleteProduct = async (id: string) => {
        await axiosInstance.delete(`/products/${id}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        products.value = products.value.filter(p => String(p._id ?? p.id) !== id)
    }

    const updateProductStock = async (
        id: string,
        stock: { stock_available: number }
    ) => {
        const { data } = await axiosInstance.patch(`/products/${id}/stock`, stock, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        const idx = products.value.findIndex(p => String(p._id ?? p.id) === id)
        if (idx !== -1 && data?.product?.updatedSQLProduct)
            products.value[idx] = {
                ...products.value[idx],
                ...data.product.updatedSQLProduct
            }
    }

    const searchProducts = async (q: string) => {
        const { data } = await axiosInstance.get('/products/search', {
            params: { q },
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        const list = data.sqlProducts ?? data.mongoProducts ?? data
        products.value = (list as any[]).map(normalizeProduct)
    }

    const searchFacetedProducts = (c: SearchCriteria) => {
        products.value = products.value.filter(
            p =>
                (!c.name || p.name.toLowerCase().includes(c.name.toLowerCase())) &&
                (!c.category ||
                    p.category?.toLowerCase() === c.category.toLowerCase()) &&
                (!c.brand || p.brand?.toLowerCase() === c.brand.toLowerCase()) &&
                (c.priceMin === undefined || Number(p.price) >= c.priceMin) &&
                (c.priceMax === undefined || Number(p.price) <= c.priceMax) &&
                (!c.inStock || (p.stock_available ?? 0) > 0) &&
                (!c.onSale || p.is_on_sale)
        )
    }

    return {
        products,
        fetchProducts,
        getProductById,
        createProduct,
        uploadProductImages,
        updateProduct,
        deleteProduct,
        updateProductStock,
        searchProducts,
        searchFacetedProducts
    }
})
