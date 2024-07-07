<template>
  <nav class="navbar">
    <div class="title">
      <router-link class="navbar-brand" to="/home">Bandage</router-link>
    </div>

    <div class="links">
      <li class="nav-item"><router-link class="nav-link" to="/home">Home</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/products">Shop</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/about">About</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/blog">Blog</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/contact">Contact</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/pages">Pages</router-link></li>
    </div>

    <ul class="linkTwo">
      <li class="nav-item"><a class="nav-link2" href="#" @click.prevent="$emit('openAuthModal')">Login/Register</a></li>
      <li class="nav-item"><router-link class="nav-link2" to="/profile"><img src="@/assets/Vector.svg" alt="profile"></router-link></li>
      <li class="nav-item"><router-link class="nav-link2" to="/cart"><img src="@/assets/Panier.svg" alt="cart"></router-link></li>
      <li class="nav-item"><router-link class="nav-link2" to="/wishlist"><img src="@/assets/hart.svg" alt="wishlist"></router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
defineEmits(['openAuthModal']);
</script>

<style scoped>
.navbar {
  display: flex;
  /* justify-content: space-between; */
  width: 100%;
  background-color: white;
  /* padding: 10px 20px; */
  color: black;
  PADDING: 19px;
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

/* .navbar-brand {
    color: black;
    text-decoration: none;
    font-size: 1.5em;
} */
</style>