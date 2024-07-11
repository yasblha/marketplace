// src/stores/cart.ts
import { defineStore } from 'pinia';
import { products } from '../products_simulate/products_data';

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  stock_available: number;
  vendor: string;
  price: number;
  images: string[];
  quantity?: number; // Ajouter la propriété quantité directement sur le produit
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [] as Product[],
    products: products as Product[]
  }),
  getters: {
    cartTotal: (state) => {
      return state.cart.reduce((total, product) => total + product.price * (product.quantity || 0), 0);
    },
    isProductInStock: (state) => {
      return (productId: string, quantity: number) => {
        const product = state.products.find(p => p._id === productId);
        return product ? product.stock_available >= quantity : false;
      };
    }
  },
  actions: {
    addToCart(productId: string, quantity: number) {
      const product = this.products.find(p => p._id === productId);
      if (product && product.stock_available >= quantity) {
        const cartProduct = this.cart.find(p => p._id === productId);
        if (cartProduct) {
          cartProduct.quantity = (cartProduct.quantity || 0) + quantity;
        } else {
          this.cart.push({ ...product, quantity });
        }
        product.stock_available -= quantity;
        console.log('Product added to cart:', productId, 'Quantity:', quantity);
        console.log('Current cart in store:', this.cart);
      } else {
        alert('Le produit n\'est plus en stock.');
      }
    },
    removeFromCart(productId: string) {
      const cartProductIndex = this.cart.findIndex(p => p._id === productId);
      if (cartProductIndex !== -1) {
        const cartProduct = this.cart[cartProductIndex];
        const product = this.products.find(p => p._id === productId);
        if (product) {
          product.stock_available += cartProduct.quantity || 0;
        }
        this.cart.splice(cartProductIndex, 1);
        console.log('Product removed from cart:', productId);
        console.log('Current cart in store:', this.cart);
      }
    }
  }
});
