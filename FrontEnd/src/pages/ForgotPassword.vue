<template>
  <div class="forgot-password-container">
    <h2 class="forgot-password-title">Forgot Password</h2>

    <form @submit.prevent="requestReset" class="forgot-password-form">
      <div class="form-group">
        <label for="email" class="form-label">Email:</label>
        <input v-model="email" id="email" type="email" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Request Reset</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import axiosInstance from "@/services/api.js";
import { ref } from "vue";

const email = ref('');

async function requestReset() {
  try {
    console.log("Sending reset request for:", email.value);
    await axiosInstance.post('/api/auth/request-password-reset', { email: email.value });
    alert('Password reset email sent');
  } catch (error) {
    console.error("Reset request failed:", error);
    alert('Failed to send reset email. Please check the email address.');
  }
}
</script>

<style scoped>
.forgot-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.forgot-password-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.forgot-password-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

.form-control {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 16px;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 3px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
