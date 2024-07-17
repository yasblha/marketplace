import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: JSON.parse(localStorage.getItem('cartItems') || '[]') as { name: string; size: string; quantity: number; price: number; vendor: string; imageUrl: string }[],
    }),
    actions: {
        addToCart(product) {
            const existingItem = this.items.find(item => item.name === product.name);
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
        },
    },
});
