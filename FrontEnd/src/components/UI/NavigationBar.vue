<template>
  <nav class="navbar">
    <div class="title">
      <a class="navbar-brand" href="/home">Bandage</a>
    </div>

    <div class="links">
      <li class="nav-item"><a class="nav-link" href="/home">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="/products">Shop</a></li>
      <li class="nav-item"><a class="nav-link" href="/about">About</a></li>
      <li class="nav-item"><a class="nav-link" href="/blog">Blog</a></li>
      <li class="nav-item"><a class="nav-link" href="/contact">Contact</a></li>
      <li class="nav-item"><a class="nav-link" href="/pages">Pages</a></li>
    </div>

    <ul class="linkTwo">
      <li class="nav-item"><a class="nav-link2" href="/login">Login/Register</a></li>
      <li class="nav-item"><a class="nav-link2" href="/login"><img src="../../assets/Vector.svg" alt="icon"></a></li>
      <li class="nav-item"><a class="nav-link2" href="/login"><img src="../../assets/Panier.svg" alt="cart"></a></li>
      <li class="nav-item"><a class="nav-link2" href="/login"><img src="../../assets/hart.svg" alt="wishlist"></a></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// Any reactive state or methods can be defined here
</script>

<style scoped>
.navbar {
  display: flex;
  width: 100%;
  background-color: white;
  color: black;
  padding: 19px;
}

.title {
  margin: auto;
  font-size: 20px;
}

.links {
  display: flex;
  text-decoration: none;
  list-style: none;
  color: black;
  margin: auto;
}

.title a {
  color: rgba(37, 43, 66, 1);
  font-weight: 700;
}

.links li {
  margin-left: 18px;
}

.linkTwo {
  display: flex;
  margin: auto;
}

.linkTwo li {
  list-style: none;
  margin-left: 14px;
}

.links li a {
  color: rgba(115, 115, 115, 1);
}

.linkTwo li a {
  color: #23a6f0;
  font-weight: 500;
}
</style>
