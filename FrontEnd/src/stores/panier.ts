import { defineStore } from 'pinia';
import type { Product } from '@/stores/products';

type CartProduct = Pick<Product, '_id' | 'name' | 'price' | 'images'> & { quantity: number };

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: JSON.parse(localStorage.getItem('cartItems') || '[]') as CartProduct[],
    }),
    actions: {
        addToCart(product: Pick<Product, '_id' | 'name' | 'price' | 'images'>) {
            const existingItem = this.items.find(item => item._id === product._id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
            this.saveCart();
        },
        removeFromCart(index: number) {
            this.items.splice(index, 1);
            this.saveCart();
        },
        calculateTotals() {
            return this.items.reduce(
                (totals, item) => {
                    totals.subtotal += item.price * item.quantity;
                    totals.total += item.price * item.quantity;
                    return totals;
                },
                { subtotal: 0, total: 0 }
            );
        },
        saveCart() {
            localStorage.setItem('cartItems', JSON.stringify(this.items));
        },
        loadCart() {
            this.items = JSON.parse(localStorage.getItem('cartItems') || '[]');
            console.log(this.items);
        },
    },
});
