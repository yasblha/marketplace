<template>
    <div class="newsletter-signup">
      <h2>Subscribe to our Newsletter</h2>
      <form @submit.prevent="subscribe">
        <input type="email" v-model="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </form>
      <div v-if="message">{{ message }}</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        message: ''
      };
    },
    methods: {
      async subscribe() {
        try {
          const response = await axios.post('/newsletters/subscribe', {
            email: this.email
          });
  
          if (response.status === 201) {
            this.message = 'Subscribed successfully!';
          } else {
            this.message = `Error: ${response.data.error}`;
          }
        } catch (error) {
          this.message = `Error: ${error.response ? error.response.data.error : error.message}`;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .newsletter-signup {
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
  }
  .newsletter-signup form {
    display: flex;
    flex-direction: column;
  }
  .newsletter-signup input {
    margin-bottom: 10px;
    padding: 8px;
    font-size: 16px;
  }
  .newsletter-signup button {
    padding: 10px;
    font-size: 16px;
  }
  </style>
  