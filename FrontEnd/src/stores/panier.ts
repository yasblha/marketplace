import { ref, computed, onBeforeUnmount } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '@/services/api'
import { useAuthStore } from '@/stores/user'
import { useProductStore } from '@/stores/products'
import type { Product } from '@/types/product'

// Types
interface CartItem extends Product {
    _id: string;
    quantity: number;
    reservedUntil?: string;
    price: number;
}

// Constants
const LS_CART_KEY = 'cartItems';
const LS_BACKUP_KEY = 'pendingCart';
const CART_SYNC_TIMEOUT = 5000; // 5 secondes avant abandon de la synchronisation

// Helpers
const normalizeId = (id: string | number): string => {
    if (typeof id === 'string' && id.startsWith('pg_')) {
        return id.slice(3);
    }
    return String(id);
};

const persistCart = (items: CartItem[]): void => {
    try {
        localStorage.setItem(LS_CART_KEY, JSON.stringify(items));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde du panier:', e);
    }
};

export const useCartStore = defineStore('cart', () => {
    // Stores
    const auth = useAuthStore();
    const productStore = useProductStore();

    // State
    const items = ref<CartItem[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const lastSync = ref<number | null>(null);
    const syncInProgress = ref<boolean>(false);

    // Getters
    const isAuth = computed<boolean>(() => auth.isAuthenticated);
    const totalQty = computed<number>(() => 
        items.value.reduce((total, item) => total + item.quantity, 0)
    );
    const totals = computed<number>(() => 
        items.value.reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0)
    );
    const hasItems = computed<boolean>(() => items.value.length > 0);
    const isSynced = computed<boolean>(
        () => lastSync.value !== null && Date.now() - lastSync.value < 300000 // 5 minutes
    );

    // Initialisation
    const init = (): void => {
        try {
            const saved = localStorage.getItem(LS_CART_KEY);
            if (saved) {
                items.value = JSON.parse(saved);
            }
            // Nettoyer les éléments expirés au démarrage
            purgeExpired();
        } catch (e) {
            console.error('Erreur lors de l\'initialisation du panier:', e);
            items.value = [];
        }
    };

    // Gestion de la persistance
    const persist = (): void => {
        persistCart(items.value);
    };

    // Gestion des snapshots (pour le processus de paiement)
    const saveSnapshot = (): void => {
        try {
            localStorage.setItem(LS_BACKUP_KEY, JSON.stringify(items.value));
        } catch (e) {
            console.error('Erreur lors de la sauvegarde du snapshot:', e);
        }
    };

    const clearSnapshot = (): void => {
        try {
            localStorage.removeItem(LS_BACKUP_KEY);
        } catch (e) {
            console.error('Erreur lors de la suppression du snapshot:', e);
        }
    };

    const restoreSnapshot = (): boolean => {
        try {
            const snap = localStorage.getItem(LS_BACKUP_KEY);
            if (snap) {
                items.value = JSON.parse(snap);
                persist();
                return true;
            }
            return false;
        } catch (e) {
            console.error('Erreur lors de la restauration du snapshot:', e);
            return false;
        } finally {
            clearSnapshot();
        }
    };

    // Synchronisation avec le backend
    const syncWithBackend = async (): Promise<boolean> => {
        if (!isAuth.value || syncInProgress.value) return false;
        
        syncInProgress.value = true;
        error.value = null;
        
        try {
            const { data } = await axiosInstance.get(`/cart/${auth.user!.id}`);
            
            // Fusionner les articles du panier local avec ceux du serveur
            const serverItems = data.map((item: any) => {
                const idStr = String(item.productid);
                const mappedId = idStr.length <= 6 ? `pg_${idStr}` : idStr; // heuristique
                return {
                    ...item.product,
                    _id          : mappedId,
                    quantity     : item.quantity,
                    reservedUntil: item.reservedUntil || item.reserved_until,
                    price        : Number(item.product?.price) || 0
                };
            });
            
            // Mettre à jour le panier local
            if (serverItems.length > 0) {
                items.value = serverItems;
            }
            lastSync.value = Date.now();
            persist();
            
            return true;
        } catch (e: any) {
            console.error('Erreur lors de la synchronisation du panier:', e);
            error.value = 'Impossible de synchroniser le panier avec le serveur';
            return false;
        } finally {
            syncInProgress.value = false;
        }
    };

    // Opérations sur le panier
    const add = async (product: Product, quantity: number = 1): Promise<boolean> => {
        if (quantity < 1) return false;
        
        loading.value = true;
        error.value = null;
        
        try {
            const id = String(product._id ?? product.id);
            const existingIndex = items.value.findIndex(i => i._id === id);
            
            if (existingIndex >= 0) {
                // Mise à jour de la quantité
                items.value[existingIndex].quantity += quantity;
            } else {
                // Ajout d'un nouvel article
                items.value.push({
                    ...product,
                    _id: id,
                    quantity,
                    price: Number(product.price) || 0
                });
            }
            
            persist();
            
            // Mise à jour backend si authentifié
            if (isAuth.value) {
                try {
                    const backendId = id.startsWith('pg_') ? id.slice(3) : id;
                    await axiosInstance.post('/cart', {
                        userid    : auth.user?.id,
                        productid : backendId,
                        quantity
                    });
                    lastSync.value = Date.now();
                } catch (err) {
                    console.error('Erreur backend add cart:', err);
                }
            }
            
            return true;
        } catch (e: any) {
            console.error('Erreur lors de l\'ajout au panier:', e);
            error.value = e.response?.data?.message || 'Erreur lors de l\'ajout au panier';
            return false;
        } finally {
            loading.value = false;
        }
    };

    const setQty = async (id: string, quantity: number): Promise<boolean> => {
        if (quantity < 1) return remove(id);
        
        loading.value = true;
        error.value = null;
        
        try {
            const item = items.value.find(i => i._id === id);
            if (!item) return false;
            
            item.quantity = quantity;
            persist();
            
            if (isAuth.value) {
                try {
                    const backendId = id.startsWith('pg_') ? id.slice(3) : id;
                    await axiosInstance.put(`/cart/${backendId}`, {
                        userid    : auth.user?.id,
                        quantity
                    });
                    lastSync.value = Date.now();
                } catch (err) {
                    console.error('Erreur backend update qty:', err);
                }
            }
            
            return true;
        } catch (e: any) {
            console.error('Erreur lors de la mise à jour de la quantité:', e);
            error.value = e.response?.data?.message || 'Erreur lors de la mise à jour de la quantité';
            return false;
        } finally {
            loading.value = false;
        }
    };

    const remove = async (id: string): Promise<boolean> => {
        loading.value = true;
        error.value = null;
        
        try {
            const initialLength = items.value.length;
            items.value = items.value.filter(i => i._id !== id);
            
            if (items.value.length !== initialLength) {
                persist();
                
                if (isAuth.value) {
                    try {
                        const backendId = id.startsWith('pg_') ? id.slice(3) : id;
                        await axiosInstance.delete(`/cart/${backendId}`);
                        lastSync.value = Date.now();
                    } catch (err) {
                        console.error('Erreur backend remove cart:', err);
                    }
                }
                
                return true;
            }
            
            return false;
        } catch (e: any) {
            console.error('Erreur lors de la suppression du produit:', e);
            error.value = e.response?.data?.message || 'Erreur lors de la suppression du produit';
            return false;
        } finally {
            loading.value = false;
        }
    };

    const clear = async (): Promise<boolean> => {
        loading.value = true;
        error.value = null;
        
        try {
            if (items.value.length === 0) return true;
            
            items.value = [];
            persist();
            
            // Synchronisation avec le backend si authentifié
            if (isAuth.value) {
                try {
                    await axiosInstance.delete(`/cart/clear/${auth.user?.id}`);
                    lastSync.value = Date.now();
                } catch (e: any) {
                    // Ne pas échouer si le panier est déjà vide côté serveur
                    if (e.response?.status !== 403 && e.response?.status !== 401) {
                        throw e;
                    }
                }
            }
            
            return true;
        } catch (e: any) {
            console.error('Erreur lors du vidage du panier:', e);
            error.value = e.response?.data?.message || 'Erreur lors du vidage du panier';
            return false;
        } finally {
            loading.value = false;
        }
    };

    // Nettoyage des articles expirés
    const purgeExpired = (): void => {
        const now = new Date();
        const initialLength = items.value.length;
        
        items.value = items.value.filter(item => {
            if (item.reservedUntil && new Date(item.reservedUntil) < now) {
                return false;
            }
            return true;
        });
        
        if (items.value.length !== initialLength) {
            persist();
        }
    };

    // Initialisation au chargement du store
    init();
    
    // Nettoyage périodique des articles expirés
    const cleanupInterval = setInterval(purgeExpired, 60000); // Toutes les minutes
    
    // Nettoyage à la destruction du store
    onBeforeUnmount(() => {
        clearInterval(cleanupInterval);
    });

    // Interface publique du store
    return {
        // State
        items,
        loading,
        error,
        
        // Getters
        totalQty,
        totals,
        isAuth,
        hasItems,
        isSynced,
        
        // Actions
        add,
        setQty,
        remove,
        clear,
        saveSnapshot,
        restoreSnapshot,
        clearSnapshot,
        syncWithBackend,
        
        // Méthodes manquantes pour compatibilité
        loadCart: syncWithBackend,
        clearCart: clear,
        loadCartFromBackend: syncWithBackend,
        fetchWishlist: async () => {
            // Placeholder pour la compatibilité
            console.warn('fetchWishlist appelé mais non implémenté dans ce store');
        },
        
        // Compatibilité avec l'ancien code
        addToCart: add,
        removeFromCart: remove,
        updateQty: setQty,
        getCartTotal: () => totals.value,
        getCartItems: () => items.value,
        calculateTotals: () => ({
            total: totals.value,
            totalItems: totalQty.value
        })
    };
});
