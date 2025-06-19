<template>
  <div class="home-container">
    <AuthModal :isVisible="isAuthModalVisible" @close="closeAuthModal" />

    <!-- Hero Section -->
    <section class="hero" data-aos="fade-in">
      <div class="hero-content">
        <span class="hero-tagline">We know how large objects will act, but things on a small scale just do not act that way.</span>
        <button class="cta-button" @click="scrollToSection('featured-products')">
          Start now
          <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </section>

    <!-- Produits en Vedette -->
    <section class="produits" data-aos="fade-up">
      <div class="Oneproducts" v-for="(product, index) in featuredProducts" :key="index" :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'">
        <div class="texts">
          <span class="product-tag">{{ product.tag }}</span>
          <h1 class="product-title">{{ product.title }}</h1>
          <span class="product-cta">{{ product.cta }}</span>
        </div>
        <img :src="product.image" :alt="product.title" class="product-image" />
      </div>
    </section>

    <!-- Meilleures Ventes -->
    <section class="BestSellers" data-aos="fade-up">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Best Sellers</h2>
          <p class="section-subtitle">Découvrez nos produits les plus populaires</p>
        </div>
        <div class="allitems">
          <div class="itemOne" data-aos="zoom-in">
            <!-- Image de fond en CSS -->
          </div>
          <div class="itemTwo">
            <BestSellers_Products />
          </div>
        </div>
        <div class="text-center">
          <a href="/products" class="btn btn-primary">Voir tous les produits</a>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Ce que disent nos clients</h2>
          <p class="section-subtitle">Découvrez les avis de nos clients satisfaits</p>
        </div>
        <div class="testimonials-grid">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="testimonial-card">
            <div class="testimonial-content">
              <div class="rating">
                <i v-for="i in 5" :key="i" 
                   :class="['fas', 'fa-star', { 'active': i <= testimonial.rating }]">
                </i>
              </div>
              <p class="testimonial-text">"{{ testimonial.text }}"</p>
              <div class="testimonial-author">
                <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar" />
                <div class="author-info">
                  <h4>{{ testimonial.name }}</h4>
                  <span>{{ testimonial.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter-section">
      <div class="container">
        <div class="newsletter-content">
          <div class="newsletter-text">
            <h2>Restez informé</h2>
            <p>Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives</p>
          </div>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input 
              type="email" 
              v-model="email" 
              placeholder="Votre adresse email" 
              required 
              class="newsletter-input"
            />
            <button type="submit" class="btn btn-primary">S'abonner</button>
          </form>
        </div>
      </div>
    </section>

    <section class="products-section">
      <div class="product-card" v-for="(product, index) in products" :key="index">
        <div class="product-text">
          <span class="product-tag">{{ product.tag }}</span>
          <h1 class="product-title">{{ product.title }}</h1>
          <span class="product-cta">{{ product.cta }}</span>
        </div>
        <img :src="product.image" :alt="product.title" />
      </div>
    </section>

    <section class="best-sellers-section">
      <div class="best-sellers-container">
        <div class="featured-item">
          <img src="../assets/ui_assets/card_items.jpg" alt="Featured item" />
        </div>
        <div class="best-sellers-list">
          <BestSellers_Products />
        </div>
      </div>
    </section>

    <section class="newsletter-section">
      <div class="newsletter-content">
        <h2 class="newsletter-title">Subscribe to Our Newsletter</h2>
        <p class="newsletter-description">Stay updated with our latest products and offers</p>
        <form class="newsletter-form">
          <input type="email" placeholder="Enter your email" required>
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import NavigationBar from "@/components/UI/NavigationBar.vue";
import Footer from "@/components/UI/Footer.vue";
import BestSellers_Products from "@/components/UI/BestSellers_Products.vue";
import AuthModal from '@/components/common/AuthModal.vue';

const isAuthModalVisible = ref(false);
const email = ref('');

// Données des produits en vedette
const featuredProducts = [
  {
    tag: "Votre Espace",
    title: "Vie Unique",
    cta: "Explorer les articles",
    image: "/src/assets/image2.png"
  },
  {
    tag: "Se termine aujourd'hui",
    title: "Style Éléments",
    cta: "Explorer les articles",
    image: "/src/assets/image1.png"
  },
  {
    tag: "Votre Espace",
    title: "Vie Unique",
    cta: "Explorer les articles",
    image: "/src/assets/image3.png"
  }
];

// Initialiser AOS
onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
});

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 100,
      behavior: 'smooth'
    });
  }
}

function subscribeNewsletter() {
  alert(`Merci pour votre inscription avec l'email : ${email.value}`);
  email.value = '';
}

function openAuthModal() {
  isAuthModalVisible.value = true;
}

function closeAuthModal() {
  isAuthModalVisible.value = false;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
@import 'aos/dist/aos.css';

:root {
  --primary: #23a6f0;
  --secondary: #23856d;
  --dark: #252b42;
  --light: #ffffff;
  --light-bg: #f8f9fa;
  --gray: #737373;
  --light-gray: #f9f9f9;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease-in-out;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
}

body {
  background-color: var(--light-bg);
  color: var(--dark);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Animations */
[data-aos] {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

[data-aos].aos-animate {
  opacity: 1 !important;
  transform: none !important;
}

/* Hero Section */
.hero {
  background-image: url('@/assets/dumbels.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  position: relative;
  padding: 80px 20px;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  transform: translateY(0);
  opacity: 1;
  transition: var(--transition);
}

.hero-tagline {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 2rem;
  line-height: 1.5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.cta-button {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(35, 166, 240, 0.3);
}

.cta-button:hover {
  background-color: #1e8fd1;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(35, 166, 240, 0.4);
}

.cta-button i {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
}

.cta-button:hover i {
  transform: translateX(4px);
}

/* Produits Section */
.produits {
  display: flex;
  padding: 4rem 2rem;
  background: #f8f9fa;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.Oneproducts {
  background-color: white;
  display: flex;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: var(--transition);
  max-width: 380px;
  width: 100%;
  overflow: hidden;
}

.Oneproducts:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.texts {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 1.5rem;
}

.product-tag {
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-title {
  color: var(--dark);
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.product-cta {
  color: var(--gray);
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: var(--transition);
}

.product-cta:hover {
  color: var(--primary);
}

.product-cta::after {
  content: '→';
  margin-left: 0.5rem;
  transition: var(--transition);
}

.product-cta:hover::after {
  transform: translateX(4px);
}

.product-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
  transition: var(--transition);
}

/* Best Sellers Section */
.BestSellers {
  padding: 5rem 2rem;
  background-color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.2rem;
  color: var(--dark);
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--primary);
}

.section-subtitle {
  color: var(--gray);
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.allitems {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.itemOne {
  flex: 1;
  background-image: url('../assets/card_items.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  min-height: 400px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.itemOne::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(35, 166, 240, 0.9) 0%, rgba(35, 133, 109, 0.9) 100%);
  opacity: 0.9;
}

.itemTwo {
  flex: 2;
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .allitems {
    flex-direction: column;
  }
  
  .itemOne {
    min-height: 200px;
  }
}

@media (max-width: 768px) {
  .produits {
    padding: 2rem 1rem;
  }
  
  .Oneproducts {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .texts {
    padding-right: 0;
    margin-bottom: 1.5rem;
  }
  
  .product-image {
    margin: 0 auto;
  }
  
  .hero-tagline {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
}

/* Animation Keyframes */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

/* Container */
/* Container */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--gray);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid transparent;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--primary);
  color: var(--white);
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(58, 134, 255, 0.3);
}

.btn-outline {
  background-color: transparent;
  border-color: var(--white);
  color: var(--white);
}

.btn-outline:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.btn-light {
  background-color: var(--white);
  color: var(--primary);
}

.btn-light:hover {
  background-color: #f1f1f1;
  transform: translateY(-2px);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

/* Hero Section */
.hero-section {
  height: 100vh;
  min-height: 700px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--white);
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f725?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
  background-attachment: fixed;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 20px;
}

.hero-title {
  font-size: 4.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 2;
  animation: bounce 2s infinite;
}

.mouse {
  width: 30px;
  height: 50px;
  border: 2px solid var(--white);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  margin-bottom: 10px;
}

.wheel {
  width: 6px;
  height: 10px;
  background-color: var(--white);
  border-radius: 3px;
  animation: scroll 2s infinite;
}

.arrow {
  width: 10px;
  height: 10px;
  border-right: 2px solid var(--white);
  border-bottom: 2px solid var(--white);
  transform: rotate(45deg);
  margin: 0 auto;
}

/* Features Section */
.features-section {
  padding: 6rem 0;
  background-color: var(--white);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: var(--white);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  transition: var(--transition);
  box-shadow: var(--shadow);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 70px;
  height: 70px;
  background: rgba(58, 134, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--primary);
  font-size: 1.8rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--dark);
}

.feature-card p {
  color: var(--gray);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Featured Products Section */
.featured-section {
  padding: 6rem 0;
  background-color: var(--light);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.product-card {
  background: var(--white);
  border-radius: 10px;
}

.product-card img {
  width: 244px;
  height: 181px;
  object-fit: cover;
}

.product-text {
  display: flex;
  flex-direction: column;
  margin: auto;
  text-align: center;
}

.product-title {
  color: black;
  margin: 10px 0;
}

.product-tag, .product-cta {
  color: #808080ad;
}

.best-sellers-section {
  padding: 40px 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.best-sellers-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.featured-item {
  flex: 1;
  min-width: 300px;
  max-width: 100%;
  height: auto;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.featured-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-item:hover img {
  transform: scale(1.05);
}

.best-sellers-list {
  flex: 2;
  min-width: 300px;
}

@media (max-width: 768px) {
  .best-sellers-container {
    flex-direction: column;
  }

  .featured-item,
  .best-sellers-list {
    width: 100%;
  }
}

.newsletter-section {
  background-color: #f8f8f8;
  padding: 40px 0;
  text-align: center;
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.newsletter-description {
  color: #666;
  margin-bottom: 20px;
}

.newsletter-form {
  display: flex;
  justify-content: center;
}

.newsletter-form input {
  padding: 10px;
  width: 60%;
  border: 1px solid #ddd;
  border-radius: 3px 0 0 3px;
}

.newsletter-form button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 0 3px 3px 0;
  cursor: pointer;
}
</style>
