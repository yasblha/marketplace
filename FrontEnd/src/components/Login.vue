<template>
  <div>
    <h2>Login</h2>

    <form v-on:submit="login">
      <div class="mb-3">
        <label for="username">Email: </label>
        <input v-model="form.email" id="email" type="text" required />
      </div>
      <div class="mb-3">
        <label for="password">Password: </label>
        <input v-model="form.password" id="password" type="password" required />
      </div>
      <button class="btn btn-outline-dark" type="submit">Login</button>
    </form>

  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from "axios";
import router from "@/router/router";

export default defineComponent({
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    login: (e) => {
      e.preventDefault()
      let email = "user@email.com"
      let password = "password"
      let login = () => {
        let data = {
          email: email,
          password: password
        }
        axios.post("/api/auth/login", data)
            .then((response) => {
              console.log("Logged in")
              router.push("/dashboard")
            })
            .catch((errors) => {
              console.log("Cannot log in")
              alert('cannot log in')
            })
      }
      login()
    }
  }
});
</script>

<style scoped>
</style>
