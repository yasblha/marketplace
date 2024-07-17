<template>
  <NavigationBar />
  <section class="produits">
    <div class="GlobalItem" v-if="product">
      <div class="image-section">
        <img :src="getImage(product)" :alt="product.name" class="main-image" />
        <div class="thumbnail-images">
          <img v-for="image in product.images" :src="getImage({ images: [image] })" :key="image" :alt="product.name" class="thumbnail-image">
        </div>
      </div>
      <div class="itemDetails">
        <h2>{{ product.name }}</h2>
        <span class="price">{{ product.price.toFixed(2) }}€</span>
        <div class="description">
          <p>{{ product.description }}</p>
          <p class="source">Marque: {{ product.brand }}</p>
          <p class="availability">Disponibilité: {{ product.status === 'available' ? 'En stock' : 'Rupture de stock' }}</p>
        </div>
        <div class="PaiementOneProduct">
          <button @click="addToCart(product)" class="addToCartButton">Ajouter au panier</button>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/panier';
import { useProductStore } from '@/stores/products';
import NavigationBar from "../components/UI/NavigationBar.vue";
import Footer from "@/components/UI/Footer.vue";
import defaultImage from "@/assets/ui_assets/image1.png";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock_available: number;
  status: string;
  images: string[];
}

const route = useRoute();
const productId = route.params.id as string;
const product = ref<Product | null>(null);
const productStore = useProductStore();
const cartStore = useCartStore();

const fetchProductById = async (id: string) => {
  product.value = await productStore.getProductById(id);
};

onMounted(async () => {
  await fetchProductById(productId);
});

const addToCart = (product: Product) => {
  cartStore.addToCart({
    name: product.name,
    size: 'L', // Assurez-vous de la taille si elle est dynamique
    price: product.price,
    vendor: product.brand,
    imageUrl: getImage(product),
  });
};

const getImage = (product: Product) => {
  if (product.images && product.images.length > 0) {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${product.images[0]}`;
  }
  return defaultImage;
};
</script>



<style scoped>
.produits {
  padding: 20px;
  background-color: #f9f9f9;
}

.GlobalItem {
  display: flex;
  margin: auto;
  max-width: 1200px;
  gap: 40px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 10px;
}

.thumbnail-images {
  display: flex;
  gap: 10px;
}

.thumbnail-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s;
}

.thumbnail-image:hover {
  transform: scale(1.1);
}

.itemDetails {
  flex: 2;
  padding: 20px;
}

.itemDetails h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}

.price {
  font-size: 24px;
  color: #23a6f0;
  margin-bottom: 20px;
  display: block;
}

.description {
  margin-bottom: 20px;
}

.description p {
  margin: 10px 0;
}

.source, .availability {
  color: #777;
}

.addToCartButton {
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 15px 30px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  width: 100%;
  text-align: center;
}

.addToCartButton:hover {
  background-color: #1d94d2;
}

@media (max-width: 1200px) {
  .GlobalItem {
    flex-direction: column;
    align-items: center;
  }

  .images {
    justify-content: center;
  }

  .itemDetails {
    padding: 20px;
    text-align: center;
  }

  .description {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .GlobalItem {
    flex-direction: column;
    align-items: center;
  }

  .images {
    padding: 20px;
  }

  .main-image {
    width: 100%;
    max-width: 100%;
  }

  .itemDetails {
    padding: 20px;
    text-align: center;
  }

  .description {
    width: 90%;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .images {
    padding: 10px;
  }

  .main-image {
    padding: 5px;
  }

  .itemDetails {
    padding: 10px;
  }
}
</style>
