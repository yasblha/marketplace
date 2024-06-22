<template>
  <div class="login-container">
    <h2 class="login-title">Sign In</h2>

    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email" class="form-label">Email:</label>
        <input v-model="form.email" id="email" type="email" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input v-model="form.password" id="password" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <div class="forgot-password">
      <router-link to="/forgot-password">Forgot password?</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import axiosInstance from "@/services/api.js";
import { ref } from "vue";
import { useRouter } from "vue-router"; // Pour la redirection

const form = ref({
  email: '',
  password: ''
});

const router = useRouter();

async function login() {
  try {
    console.log("Sending form data:", form.value);
    const response = await axiosInstance.post('/api/auth/login', form.value);
    alert('Logged in successfully');
    console.log("Response received:", response.data);

    // router.push(`/${response.data.user.role}/dashboard`);
  } catch (error) {
    console.error("Login failed:", error);
    alert('Login failed. Please check your credentials.');
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.login-form {
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

.forgot-password {
  text-align: center;
  margin-top: 10px;
}

.forgot-password a {
  color: #007bff;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}
</style>
