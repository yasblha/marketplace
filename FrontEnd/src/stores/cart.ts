// src/services/cart.ts
import { ref } from 'vue';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  vendor: string;
  price: number;
  images: string[];
}

const cart = ref<Product[]>([]);

export const useCart = () => {
  const addToCart = (product: Product) => {
    cart.value.push(product);
  };

  const removeFromCart = (productId: string) => {
    cart.value = cart.value.filter(product => product._id !== productId);
  };

  const getCartTotal = () => {
    return cart.value.reduce((total, product) => total + product.price, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    getCartTotal
  };
};
