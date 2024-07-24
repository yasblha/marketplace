<template>
    <div class="generate-invoice">
      <h2>Generate Invoice</h2>
      <form @submit.prevent="generateInvoice">
        <label for="orderId">Order ID:</label>
        <input type="number" v-model="orderId" required />
        <button type="submit">Generate Invoice</button>
      </form>
      <div v-if="message">{{ message }}</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        orderId: null,
        message: ''
      };
    },
    methods: {
      async generateInvoice() {
        try {
          const response = await axios.post('/api/invoices', { orderId: this.orderId });
          if (response.status === 201) {
            const invoice = response.data;
            window.location.href = `/api/invoices/${invoice.id}/download`;
            this.message = 'Invoice generated and downloaded successfully!';
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
  .generate-invoice {
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
  }
  .generate-invoice form {
    display: flex;
    flex-direction: column;
  }
  .generate-invoice input {
    margin-bottom: 10px;
    padding: 8px;
    font-size: 16px;
  }
  .generate-invoice button {
    padding: 10px;
    font-size: 16px;
  }
  </style>
  