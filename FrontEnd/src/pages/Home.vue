<template>
  <div class="min-h-screen bg-white font-sans antialiased text-gray-900">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-0"></div>
      <div class="absolute inset-0 bg-gray-800 flex items-center justify-center">
        <img src="./../assets/ui_assets/dumbels.jpg" alt=" Dumbells Image " class="object-cover w-full" />
      </div>
      <!-- Hero Content -->
      <div class="container mx-auto px-6 relative z-10 flex items-center justify-center">
        <div class="max-w-3xl text-center text-white ">
          <span class="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            Nouvelle Collection 2025
          </span>
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            Équipez-vous pour la <span class="text-blue-400">performance</span>
          </h1>
          <p class="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Découvrez notre sélection premium d'équipements et vêtements sportifs pour atteindre vos objectifs.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              @click="scrollToSection('featured')"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3"
            >
              Découvrir nos produits
              <font-awesome-icon icon="arrow-right" class="w-4 h-4" />
            </button>
            <button 
              class="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium py-4 px-8 rounded-lg border border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              En savoir plus
            </button>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button 
          @click="scrollToSection('categories')" 
          class="text-white hover:text-blue-400 transition-colors"
          aria-label="Voir la suite"
        >
          <font-awesome-icon icon="chevron-down" class="w-6 h-6 animate-bounce" />
        </button>
      </div>
    </section>

    <!-- Categories Section -->
    <section id="categories" class="py-16 md:py-24 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <span class="inline-block text-blue-600 font-medium mb-3">Catégories</span>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Parcourir par catégorie</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos différentes gammes de produits adaptés à vos besoins sportifs.
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            v-for="(category, index) in categories" 
            :key="index"
            class="group relative rounded-xl overflow-hidden h-48 md:h-64 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <span class="text-white text-opacity-50">{{ category.name }}</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <h3 class="text-white text-lg font-semibold mb-1">{{ category.name }}</h3>
                <span class="text-blue-300 text-sm font-medium flex items-center">
                  {{ category.count }} {{ category.count > 1 ? 'produits' : 'produit' }}
                  <font-awesome-icon icon="arrow-right" class="ml-2 text-xs" />
                </span>
              </div>
            </div>
          </div>
          <div v-if="isLoading && categories.length === 0"
               class="col-span-4 flex items-center justify-center py-12">
            <font-awesome-icon icon="fas fa-spinner" class="animate-spin text-blue-600 text-4xl" />
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section id="featured" class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div class="mb-4 md:mb-0">
            <span class="inline-block text-blue-600 font-medium mb-2">Produits Sélectionnés</span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Nos Produits Phares</h2>
          </div>
          <a href="/products" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Voir tout
            <i class="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(product, index) in featuredProducts" 
            v-if="!isLoading"
            :key="product._id"
            class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="relative group">
              <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                <img 
                  v-if="getProductImage(product)"
                  :src="getProductImage(product)" 
                  :alt="product.name"
                  class="h-64 w-full object-cover object-center"
                  @error="$event.target.style.display='none'"
                />
                <div v-else class="h-64 w-full bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-400">{{ product.name || 'Image non disponible' }}</span>
                </div>
              </div>
              <div class="absolute top-3 right-3 flex flex-col gap-2">
                <button 
                  @click="toggleFavorite(product._id)" 
                  class="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-red-500 transition-colors"
                  :class="{ 'text-red-500': wishlistStore.isInWishlist(product._id) }"
                >
                  <font-awesome-icon 
                    :icon="wishlistStore.isInWishlist(product._id) ? 'fas fa-heart' : 'far fa-heart'" 
                    class="w-5 h-5" 
                  />
                </button>
                <button class="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors">
                  <font-awesome-icon icon="fa-regular fa-eye" class="w-5 h-5" />
                </button>
              </div>
              <div v-if="product.status === 'sale'" class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <span class="inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 bg-red-500 text-white">
                  Promo
                </span>
              </div>
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{{ product.name }}</h3>
                <div v-if="product.rating" class="flex items-center">
                  <font-awesome-icon 
                    v-for="i in 5" 
                    :key="i" 
                    :icon="i <= Math.round(product.rating) ? 'fas fa-star' : 'far fa-star'" 
                    class="w-4 h-4 text-yellow-400"
                  />
                </div>
              </div>
              <p v-if="product.reviews" class="text-sm text-gray-500 mb-3">{{ product.reviews }} avis</p>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-lg font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
                  <span v-if="product.originalPrice" class="ml-2 text-sm text-gray-500 line-through">{{ formatPrice(product.originalPrice) }}</span>
                </div>
                <button 
                  @click="addToCart(product._id)" 
                  class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                  :disabled="isLoading"
                >
                  <font-awesome-icon 
                    :icon="isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-shopping-cart'" 
                    class="w-4 h-4" 
                  />
                </button>
              </div>
            </div>
          </div>
          <div v-else class="col-span-4 flex items-center justify-center py-12">
            <font-awesome-icon icon="fas fa-spinner" class="animate-spin text-blue-600 text-4xl" />
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-24 bg-gray-50">
      <div class="container px-6 mx-auto">
        <div class="mb-16 text-center">
          <span class="inline-block text-blue-600 font-medium mb-3">Témoignages</span>
          <h2 class="mb-4 text-4xl font-bold text-gray-900">Ce que disent nos clients</h2>
          <p class="max-w-2xl mx-auto text-lg text-gray-600">
            Découvrez pourquoi nos clients nous font confiance pour leurs équipements sportifs.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(testimonial, index) in testimonials" 
            :key="index"
            class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="flex items-center mb-6">
              <div class="flex-shrink-0">
                <div class="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center">
                  <span class="text-white text-opacity-50">{{ testimonial.name.charAt(0) }}</span>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-semibold text-gray-900">{{ testimonial.name }}</h4>
                <p class="text-blue-600 text-sm">{{ testimonial.role }}</p>
              </div>
            </div>
            <div class="mb-4">
              <div class="flex text-yellow-400 mb-2">
                <i v-for="i in 5" :key="i" class="fas fa-star text-sm"></i>
              </div>
              <p class="text-gray-600 italic">"{{ testimonial.comment }}"</p>
            </div>
            <div class="text-right">
              <span class="text-blue-600 text-sm font-medium">
                <i class="fas fa-quote-right text-blue-200 mr-1"></i> Voir l'avis complet
              </span>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <button class="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300">
            Voir plus d'avis
          </button>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Prêt à transformer votre entraînement ?</h2>
          <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de sportifs satisfaits qui nous font confiance pour leurs équipements.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button class="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center">
              Découvrir nos produits
              <i class="fas fa-arrow-right ml-3"></i>
            </button>
            <button class="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-300">
              Nous contacter
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faArrowDown, 
  faArrowRight, 
  faPaperPlane,
  faTshirt,
  faWind,
  faMagic,
  faStar,
  faShoppingCart,
  faHeart,
  faEye,
  faQuoteRight,
  faEnvelope,
  faChevronDown,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { faStar as farStar, faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

// Import des stores
import { useProductStore } from '@/stores/products';
import { useWishlistStore } from '@/stores/wishlist';
import { useCartStore } from '@/stores/panier';

// Initialisation des stores
const productStore = useProductStore();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

// Add icons to library
library.add(
  faArrowDown, 
  faArrowRight, 
  faPaperPlane,
  faTshirt,
  faWind,
  faMagic,
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn,
  faYoutube,
  faStar,
  farStar,
  faShoppingCart,
  faHeart,
  farHeart,
  faEye,
  faQuoteRight,
  faEnvelope,
  faChevronDown,
  faSpinner
);

// State
const email = ref('');
const isLoading = ref(false);
const privacyAccepted = ref(false);
const isInitialized = ref(false);

// Charger les données au montage du composant
const loadData = async () => {
  try {
    isLoading.value = true;
    await Promise.all([
      productStore.fetchProducts(),
      wishlistStore.loadWishlist()
    ]);
    
    // Si l'utilisateur est connecté, charger son panier
    if (localStorage.getItem('authToken')) {
      await cartStore.loadCartFromBackend();
    } else {
      cartStore.loadCart();
    }
    
    isInitialized.value = true;
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  } finally {
    isLoading.value = false;
  }
};

// Données réactives depuis les stores
const featuredProducts = computed(() => {
  // Prendre les 4 premiers produits comme produits phares
  return productStore.products.slice(0, 4).map(product => ({
    ...product,
    isFavorite: wishlistStore.isInWishlist(product._id)
  }));
});

// Catégories dynamiques basées sur les produits
const categories = computed(() => {
  const categoryCounts: Record<string, number> = {};
  
  productStore.products.forEach(product => {
    if (product.category) {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    }
  });
  
  return Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count
  }));
});

// Témoignages (toujours statiques pour l'exemple)
const testimonials = ref([
  {
    name: 'Jean Dupont',
    role: 'Coach sportif',
    comment: 'Matériel de qualité supérieure. Mes clients adorent !',
    rating: 5,
    date: '15/06/2023'
  },
  {
    name: 'Marie Martin',
    role: 'Athlète amateur',
    comment: 'Livraison rapide et produits conformes à mes attentes.',
    rating: 4,
    date: '22/05/2023'
  },
  {
    name: 'Thomas Leroy',
    role: 'Débutant en fitness',
    comment: 'Excellent rapport qualité-prix. Je recommande vivement !',
    rating: 5,
    date: '10/06/2023'
  }
]);

// Marques (toujours statiques pour l'exemple)
const brands = ref([
  { name: 'Nike' },
  { name: 'Adidas' },
  { name: 'Puma' },
  { name: 'Under Armour' },
  { name: 'Reebok' }
]);

// Helper methods
const getProductImage = (product: any) => {
  if (!product) return null;
  
  try {
    // Gestion des images pour les produits MongoDB
    if (product.images && product.images.length > 0) {
      const imagePath = product.images[0];
      const imageName = imagePath.split('/').pop();
      return `http://localhost:3000/uploads/${imageName}`;
    }
    
    // Gestion des images pour les produits PostgreSQL
    if (product.image) {
      // Essayer de parser le champ image qui est une chaîne JSON
      const images = typeof product.image === 'string' 
        ? JSON.parse(product.image.replace(/\"/g, '"')) 
        : product.image;
        
      if (Array.isArray(images) && images.length > 0) {
        const imagePath = images[0];
        const imageName = imagePath.split('/').pop();
        return `http://localhost:3000/uploads/${imageName}`;
      }
    }
  } catch (e) {
    console.error('Erreur lors du traitement de l\'image:', e);
  }
  
  return null;
};

// Methods
const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 80,
      behavior: 'smooth'
    });
  }
};

const subscribeNewsletter = async () => {
  if (!email.value) return;
  
  isLoading.value = true;
  
  try {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(`Merci de vous être abonné avec l'email : ${email.value}`);
    email.value = '';
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    alert('Une erreur est survenue. Veuillez réessayer plus tard.');
  } finally {
    isLoading.value = false;
  }
};

const toggleFavorite = async (productId: string) => {
  try {
    await wishlistStore.toggleWishlistItem({
      id: productId,
      ...productStore.products.find(p => p._id === productId)
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des favoris:', error);
  }
};

const addToCart = async (productId: string) => {
  try {
    const product = productStore.products.find(p => p._id === productId);
    if (product) {
      await cartStore.addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
  }
};

const openAuthModal = () => {
  isAuthModalVisible.value = true;
};

const closeAuthModal = () => {
  isAuthModalVisible.value = false;
};

const getRatingStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push('full');
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }
  
  return stars;
};

const getTagClass = (tag: string) => {
  const tagClasses: { [key: string]: string } = {
    'Nouveauté': 'bg-blue-100 text-blue-800',
    'Promo': 'bg-red-100 text-red-800',
    'Meilleure vente': 'bg-yellow-100 text-yellow-800',
    'Coup de cœur': 'bg-pink-100 text-pink-800',
    'Tendance': 'bg-purple-100 text-purple-800',
  };
  
  return tagClasses[tag] || 'bg-gray-100 text-gray-800';
};

const formatPrice = (price: number | string) => {
  // Convertir en nombre si c'est une chaîne
  const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(priceNumber);
};

// Lifecycle Hooks
onMounted(async () => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-out-cubic'
  });
  
  // Charger les données au montage
  await loadData();
});

// Expose methods
defineExpose({
  scrollToSection,
  subscribeNewsletter,
  toggleFavorite,
  addToCart,
  openAuthModal,
  closeAuthModal
});
</script>

<style>
/* AOS Animation */
[data-aos] {
  opacity: 0;
  transition-property: opacity, transform;
}

[data-aos].aos-animate {
  opacity: 1;
  transform: translateZ(0);
}

/* Custom animations */
@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus styles for better accessibility */
button:focus, a:focus, input:focus, textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  ring: 2px;
  ring-color: #93c5fd;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
</style>