import { defineStore } from 'pinia';
import { products } from '../products_simulate/products_data';

export interface Product {
  Id: string;
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
    cartItems: (state) => state.cart,
    cartTotal: (state) => state.cart.reduce((total, product) => total + product.price * (product.quantity || 0), 0),
    isProductInStock: (state) => {
      return (productId: string, quantity: number) => {
        const product = state.products.find(p => p.Id === productId);
        return product ? product.stock_available >= quantity : false;
      };
    }
  },
  actions: {
    addToCart(productId: string, quantity: number) {
      const product = this.products.find(p => p.Id === productId);
      if (product && product.stock_available >= quantity) {
        const cartProduct = this.cart.find(p => p.Id === productId);
        if (cartProduct) {
          cartProduct.quantity = (cartProduct.quantity || 0) + quantity;
        } else {
          this.cart.push({ ...product, quantity });
        }
        product.stock_available -= quantity;
        this.persistState();
        console.log('Product added to cart:', productId, 'Quantity:', quantity);
        console.log('Current cart in store:', this.cart);
        console.log('Available products in store:', this.products);
      } else {
        alert('Le produit n\'est plus en stock.');
      }
    },
    removeFromCart(productId: string) {
      const cartProductIndex = this.cart.findIndex(p => p.Id === productId);
      if (cartProductIndex !== -1) {
        const cartProduct = this.cart[cartProductIndex];
        const product = this.products.find(p => p.Id === productId);
        if (product) {
          product.stock_available += cartProduct.quantity || 0;
        }
        this.cart.splice(cartProductIndex, 1);
        this.persistState();
        console.log('Product removed from cart:', productId);
        console.log('Current cart in store:', this.cart);
        console.log('Available products in store:', this.products);
      }
    },
    updateCartQuantity(productId: string, quantity: number) {
      const cartProduct = this.cart.find(p => p.Id === productId);
      const product = this.products.find(p => p.Id === productId);
      if (cartProduct && product) {
        const difference = quantity - cartProduct.quantity;
        if (product.stock_available >= difference) {
          cartProduct.quantity = quantity;
          product.stock_available -= difference;
          if (cartProduct.quantity <= 0) {
            this.removeFromCart(productId);
          } else {
            this.persistState();
          }
          console.log('Product quantity updated:', productId, 'New Quantity:', quantity);
        } else {
          alert('Le produit n\'est plus en stock.');
        }
      }
    },
    persistState() {
      console.log('Persisting state to localStorage');
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    loadState() {
      console.log('Loading state from localStorage');
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cart = JSON.parse(storedCart);
        console.log('Loaded cart:', this.cart);
      }
    }
  }
});
