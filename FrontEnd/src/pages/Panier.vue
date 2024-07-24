<template>
    <NavigationBar />
    
    <section>
      <div class="titles">
        <h2>Your cart</h2>
        <span>Not ready to checkout? Continue Shopping</span>
      </div>
      <div class="globalPanier">
        <div v-if="cartItems.length === 0">
          <p>Your cart is empty</p>
        </div>
        <div v-else>
          <div class="ProductFiche" v-for="product in cartItems" :key="product.Id">
            <div class="produit">
              <img :src="product.images[0]" alt="">
              <div class="infos">
                <div class="titleChekbox">
                  <h3>{{ product.name }}</h3>
                  <span class="PriceNumber">${{ product.price }}</span>
                </div>
                <div class="Qte">
                  <label for="quantitySelect">Quantité </label>
                  <div class="custom-select-container">
                    <button @click="decreaseQuantity(product)">-</button>
                    <span>{{ product.quantity }}</span>
                    <button @click="increaseQuantity(product)">+</button>
                  </div>
                </div>
                <div class="priceDelete">
                  <button @click="removeProduct(product.Id)">Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="paiments" v-if="cartItems.length > 0">
          <h2>Order Summary</h2>
          <div>
            <span>Subtotal</span>
            <span>${{ cartTotal.toFixed(2) }}</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>Calculated at the next step</span>
          </div>
          <div>
            <span>Total</span>
            <span>${{ cartTotal.toFixed(2) }}</span>
          </div>
          <button @click="redirectToCheckout">Continue to checkout</button>
        </div>
      </div>
    </section>
    
    <Footer />
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { useCartStore } from '@/stores/cart';
  import { stripePromise } from '../../functions/stripe';
  import axios from 'axios';
  import NavigationBar from "../components/UI/NavigationBar.vue";
  import Footer from "../components/UI/Footer.vue";
  
  const cartStore = useCartStore();
  console.log('Cart store initialized:', cartStore);
  
  const cartItems = computed(() => cartStore.cartItems);
  const cartTotal = computed(() => cartStore.cartTotal);
  
  console.log('Cart Total in Panier.vue:', cartTotal.value.toFixed(2));
  console.log('Cart Items in Panier.vue:', cartItems.value);
  
  const removeProduct = (productId: string) => {
    console.log('Removing product from cart:', productId);
    cartStore.removeFromCart(productId);
    console.log('Updated Cart in Panier.vue:', cartStore.cart);
    console.log('Updated Products in Panier.vue:', cartStore.products);
  };
  
  const decreaseQuantity = (product) => {
    cartStore.updateCartQuantity(product.Id, product.quantity - 1);
  };
  
  const increaseQuantity = (product) => {
    cartStore.updateCartQuantity(product.Id, product.quantity + 1);
  };
  
  const redirectToCheckout = async () => {
    const stripe = await stripePromise;
  
    try {
      const response = await axios.post('http://localhost:4242/create-payment-intent', {
        items: cartItems.value.map(product => ({
          id: product.Id,
          quantity: product.quantity,
          name: product.name,
          price: product.price
        }))
      });
  
      const { clientSecret } = response.data;
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Test User',
          },
        },
      });
  
      if (result.error) {
        console.error("Payment failed:", result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          console.log("Payment succeeded!");
          window.location.href = "/success";
        }
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  
  
  
  
  
  
  
  
  
  

<style scoped>
div.globalPanier {
    display: flex;
    margin: 39px;
    justify-content: space-around;
}

.selectQuantie {
    margin-left: 9px;
    background: #8080802e;
    border-radius: 4px;
    border: 1px solid #80808085;
    outline: none;
    width: 25%;
    padding: 3px;

}

.selectinput {
    padding: 4px;
    width: 21%;
    margin-left: 10px;
    border-radius: 5px;
    outline: none;
    border: 1px solid grey;

}

div.Qte {
    display: flex;
}

div.titles {
    margin: 18px 159px;
    display: flex;
    flex-direction: column;
}


div.titles span {}

div.titles h2 {
    font-weight: 600;
}

div.ProductFiche {
    width: 43%;
}

div.produit img {
    width: 151px;
    height: 154px;
    object-fit: cover;


}

.selected {

    margin-right: 10px;
}

div.titleChekbox {

    display: flex;
    justify-content: space-between
}

.PriceNumber {

    font-size: 22px;
    font-weight: 500;
}

/* div.infos input {
    width: 6%;
} */

div.produit {
    display: flex;
    padding-top: 14px;
    border-bottom: 1px solid #8080804a;

}

div.infos {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    height: 100%;
    padding: 15px;
    width: 100%;
    margin: auto;
}

div.infos span {}

div.infos h3 {

    font-size: 25px;
    font-weight: 600;
}

div.priceDelete {
    display: flex;
    justify-content: space-between;
}

div.priceDelete span {
    font-size: 22px;
    font-weight: 600;

}


div.priceDelete button {

    background: none;
    border: none;
    color: #007185 !important;
    padding-top: 10px;
    cursor: pointer;
}

div.paiments {
    margin-left: 54px;
    padding: 12px;
    width: 30%;
}

div.paiments h2 {
    margin-bottom: 15px;
}

div.paiments input {
    width: 100%;
    padding: 6px;
}

div.paiments div {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

div.paiments span {}

div.paiments button {

    padding: 8px;
    width: 100%;
    background: black;
    color: white;
    border: none;
}

div.OrderF {
    padding: 22px;
    /* width: 100%; */
    margin-left: 95px;
}

div.OrderF h3 {
    font-size: 29px;
    font-weight: 600;
    border-bottom: 2px solid black;
    width: 24%;
    margin-bottom: 23px;
}

div.buttonAndText {
    color: grey;
    border-bottom: 1px solid;
    width: 53%;
    padding-bottom: 17px;

}

div.buttonAndText div span {}

div.buttonAndText div button {

    color: grey;
    background: none;
    border: none;
    font-size: 19px;
    cursor: pointer;


}

div.buttonAndText div {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 17px;

}

div.buttonAndText p {
    font-size: 12px;

}

div.SelectAll {

    display: flex;
    justify-content: space-around;
    margin: 28px;

}

div.SelectAll span {}

div.SelectAll input {
    width: 4%;
}


@media (max-width: 1200px) {
    div.globalPanier {
        flex-direction: column;
        align-items: center;
    }

    div.paiments {
        margin-left: 0;
        width: 80%;
    }

    div.ProductFiche {
        width: 80%;
    }

    div.OrderF {
        margin-left: 0;
        width: 80%;
    }

    div.OrderF h3 {
        width: 100%;
    }
}

@media (max-width: 768px) {
    div.globalPanier {
        margin: 20px;
    }

    div.titles {
        margin: 20px 0;
        text-align: center;
    }

    div.titles h2 {
        font-size: 24px;
    }

    div.ProductFiche {
        width: 100%;
    }

    div.paiments {
        width: 100%;
        margin-left: 0;
    }

    div.OrderF {
        width: 100%;
        margin-left: 0;
        padding: 0 20px;
    }

    div.buttonAndText {
        width: 100%;
    }
}

@media (max-width: 480px) {
    div.globalPanier {
        margin: 10px;
    }

    div.titles h2 {
        font-size: 20px;
    }

    div.produit img {
        width: 100px;
        height: 100px;
    }

    div.produit {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    div.infos {
        padding: 10px;
    }

    div.infos h3 {
        font-size: 20px;
    }

    div.priceDelete {
        flex-direction: column;
        align-items: center;
    }

    div.priceDelete span {
        font-size: 18px;
    }

    div.priceDelete button {
        margin-top: 10px;
    }

    div.paiments {
        width: 100%;
    }

    div.paiments input {
        padding: 8px;
    }

    div.paiments div {
        font-size: 12px;
    }

    div.paiments button {
        padding: 10px;
    }

    div.OrderF h3 {
        font-size: 24px;
    }

    div.OrderF {
        width: 100%;
        margin-left: 0;
    }

    div.SelectAll span {
        font-size: 14px;
    }

    div.SelectAll input {
        width: 5%;
    }
}
</style>