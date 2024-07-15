<script setup>
import { ref, onMounted } from 'vue';

const currentIndex = ref(0);
const categoryList = ref(null);

const slide = (direction) => {
  const maxIndex = 6; // Nombre total de catégories - 1
  if (direction === 'left' && currentIndex.value > 0) {
    currentIndex.value--;
  } else if (direction === 'right' && currentIndex.value < maxIndex) {
    currentIndex.value++;
  }
};

onMounted(() => {
  if (categoryList.value) {
    categoryList.value.style.width = `${7 * 100}px`; // 7 est le nombre total de catégories
  }
});
</script>

<template>
  <div class="Categorie">
    <ul ref="categoryList" :style="{ transform: `translateX(${-currentIndex * 100}px)` }">
      <li>BESTSELLER PRODUCTS</li>
      <li><a href="">Men</a></li>
      <li><a href="">Women</a></li>
      <li><a href="">Accessories</a></li>
      <li><a href="">Shoes</a></li>
      <li><a href="">Bags</a></li>
      <li><a href="">Watches</a></li>
    </ul>
    <div class="fleches">
      <a href="#" @click.prevent="slide('left')"><img src="../../assets/fg.svg" alt="Left Arrow"></a>
      <a href="#" @click.prevent="slide('right')"><img src="../../assets/fd.svg" alt="Right Arrow"></a>
    </div>
  </div>
  <div class="bestProducts">
    <div class="product" v-for="(product, index) in products" :key="index">
      <img :src="product.image" alt="Graphic Design">
      <h2>{{ product.title }}</h2>
      <p>{{ product.description }}</p>
      <div class="prices">
        <span class="priceNormal">{{ product.priceNormal }}</span>
        <span class="priceBlue">{{ product.priceBlue }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Categorie {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  overflow: hidden;
}

.Categorie ul {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
  transition: transform 0.3s ease;
}

.Categorie ul li {
  flex: 0 0 100px;
  text-align: center;
}

.fleches {
  display: flex;
  gap: 10px;
}

.bestProducts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 25px;
  width: 100%;
}

.product {
  text-align: center;
}

.product img {
  width: 100%;
  max-width: 200px;
}

.product h2 {
  font-size: 18px;
  margin: 10px 0;
}

.product p {
  color: grey;
  font-size: 14px;
  margin: 5px 0;
}

.prices {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.priceNormal {
  color: grey;
}

.priceBlue {
  color: rgba(35, 133, 109, 1);
}
</style>
