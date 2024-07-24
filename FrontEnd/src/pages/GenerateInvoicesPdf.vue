<template>
  <div class="checkout-page">
    <div class="titles">
      <h2>Generate Invoice</h2>
      <span>Provide your Order ID to generate an invoice</span>
    </div>
    <section class="checkout-container">
      <div class="checkout-form">
        <div class="steps">
          <span class="active-step">Generate Invoice</span>
        </div>
        <form @submit.prevent="generateInvoice">
          <label for="orderId">Order ID:</label>
          <input type="number" v-model="orderId" required />
          <button type="submit">Generate Invoice</button>
        </form>
        <div v-if="message">{{ message }}</div>
      </div>
    </section>
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
        const response = await axios.post('http://localhost:3000/api/invoices', { orderId: this.orderId });
        if (response.status === 201) {
          const invoice = response.data;
          this.downloadInvoice(invoice.id);
          this.message = 'Invoice generated successfully!';
        } else {
          this.message = `Error: ${response.data.error}`;
        }
      } catch (error) {
        this.message = `Error: ${error.response ? error.response.data.error : error.message}`;
      }
    },
    async downloadInvoice(invoiceId) {
      try {
        const response = await axios.get(`http://localhost:3000/api/invoices/${invoiceId}/download`, {
          responseType: 'blob' 
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${invoiceId}.pdf`);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        this.message = `Error downloading invoice: ${error.response ? error.response.data.error : error.message}`;
      }
    }
  }
};
</script>

<style scoped>
.checkout-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.checkout-container {
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.checkout-form {
  width: 60%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
}

.steps {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.steps .active-step {
  font-weight: bold;
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

.message {
  margin-top: 10px;
}
</style>
