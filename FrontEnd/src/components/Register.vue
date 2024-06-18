<template>
  <div class="register-card">
    <h2 class="card-title">Register</h2>
    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-group">
        <label for="role" class="form-label">Role:</label>
        <select v-model="form.role" id="role" class="form-control" required>
          <option value="">Select a role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
      </div>
      <div class="form-group">
        <label for="email" class="form-label">Email:</label>
        <input v-model="form.email" id="email" type="email" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="firstName" class="form-label">First Name:</label>
        <input v-model="form.firstName" id="firstName" type="text" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="lastName" class="form-label">Last Name:</label>
        <input v-model="form.lastName" id="lastName" type="text" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input v-model="form.password" id="password" type="password" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="password_confirm" class="form-label">Confirm Password:</label>
        <input v-model="form.password_confirm" id="password_confirm" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axiosInstance from "@/services/api";

export default defineComponent({
  data() {
    return {
      form: {
        role: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        password_confirm: ''
      }
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axiosInstance.post('/api/auth/register', this.form);
        alert('User registered successfully!');
        console.log(response);
      } catch (error : any) {
        alert(error.response.data.message || 'An error occurred');
      }
    }
  }
});
</script>

<style scoped>
.register-card {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.register-form {
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