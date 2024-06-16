<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="username">Username: </label>
      <input v-model="form.username" id="username" type="text" required />
    </div>
    <div class="mb-3">
      <label for="email">Email: </label>
      <input v-model="form.email" id="email" type="email" required />
    </div>
    <div class="mb-3">
      <label for="firstName">First Name: </label>
      <input v-model="form.firstName" id="firstName" type="text" required />
    </div>
    <div class="mb-3">
      <label for="lastName">Last Name: </label>
      <input v-model="form.lastName" id="lastName" type="text" required />
    </div>
    <div class="mb-3">
      <label for="password">Password: </label>
      <input v-model="form.password" id="password" type="password" required />
    </div>
    <div class="mb-3">
      <label for="password_confirm">Confirm Password: </label>
      <input v-model="form.password_confirm" id="password_confirm" type="password" required />
    </div>
    <button class="btn btn-outline-dark" type="submit">Register</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from "axios";

export default defineComponent({
  data() {
    return {
      form: {
        username: '',
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
        //const response = await this.$axios('/register', this.form);
        alert('User registered successfully!');
      } catch (error : any) {
        alert(error.response.data.message || 'An error occurred');
      }
    }
  }
});
</script>

<style scoped>
/* Ajoutez votre style ici */
</style>
