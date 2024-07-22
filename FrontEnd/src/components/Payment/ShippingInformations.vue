<template>
  <section class="shipping-info">
    <div class="container">
      <h2>Shipping Information</h2>
      <form @submit.prevent="nextStep">
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input type="text" id="fullName" v-model="shippingInfo.fullName" required />
        </div>
        <div class="form-group">
          <label for="address">Address</label>
          <input type="text" id="address" v-model="shippingInfo.address" required />
        </div>
        <div class="form-group">
          <label for="city">City</label>
          <input type="text" id="city" v-model="shippingInfo.city" required />
        </div>
        <div class="form-group">
          <label for="postalCode">Postal Code</label>
          <input type="text" id="postalCode" v-model="shippingInfo.postalCode" required />
        </div>
        <div class="form-group">
          <label for="country">Country</label>
          <input type="text" id="country" v-model="shippingInfo.country" required />
        </div>
        <button type="submit">Continue to Shipping Options</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const shippingInfo = ref({
  fullName: '',
  address: '',
  city: '',
  postalCode: '',
  country: ''
});

const router = useRouter();

const nextStep = () => {
  localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo.value));
  router.push({ name: 'ShippingOptions' });
};
</script>

<style scoped>
.shipping-info {
  padding: 20px;
  background-color: #f9f9f9;
}

.container {
  max-width: 600px;
  margin: auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #218838;
}
</style>
