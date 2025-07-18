<template>
  <div class="bg-white rounded-lg shadow p-4 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">Évolution des stocks</h3>
      <div class="flex items-center space-x-2">
        <select 
          v-model="selectedPeriod" 
          @change="updateChartData"
          class="form-select rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
          <option value="90">3 derniers mois</option>
          <option value="180">6 derniers mois</option>
          <option value="365">Dernière année</option>
        </select>
        <button 
          @click="showFilterModal = true"
          class="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i class="fas fa-filter mr-1"></i>
          Filtrer
        </button>
      </div>
    </div>

    <!-- États de chargement et d'erreur -->
    <div v-if="loading" class="h-80 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="h-80 flex items-center justify-center">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-3xl text-red-500 mb-2"></i>
        <p class="text-gray-600">Une erreur s'est produite lors du chargement des données.</p>
        <button 
          @click="fetchStockHistory"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Le graphique -->
    <div v-else class="h-80">
      <canvas ref="stockChart"></canvas>
      <!-- Afficher un message de débogage si le graphique ne se charge pas -->
      <div v-if="debug" class="p-2 bg-yellow-100 border border-yellow-400 rounded mt-2">
        <p class="text-sm">Debug: {{ debugInfo }}</p>
      </div>
    </div>

    <!-- Alertes de stock bas -->
    <div v-if="lowStockProducts.length > 0" class="mt-4 border-t pt-4">
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-sm font-medium text-red-600">
          <i class="fas fa-exclamation-triangle mr-1"></i>
          {{ lowStockProducts.length }} produit(s) en stock bas
        </h4>
        <button 
          @click="showLowStockModal = true"
          class="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Voir tous
        </button>
      </div>
      <div class="flex flex-nowrap overflow-x-auto pb-2 space-x-2 scrollbar-hide">
        <div 
          v-for="product in lowStockProducts.slice(0, 3)" 
          :key="product.id"
          class="flex-shrink-0 bg-red-50 border border-red-200 rounded-md p-2 w-64"
        >
          <div class="flex items-center">
            <img 
              :src="product.imageUrl || 'https://via.placeholder.com/40x40'" 
              :alt="product.name"
              class="w-10 h-10 object-cover rounded-md mr-3"
            >
            <div class="flex-1 overflow-hidden">
              <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
              <p class="text-xs text-red-600">Stock: {{ product.stock }} / Seuil: {{ product.threshold }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal pour les filtres avancés -->
  <div v-if="showFilterModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showFilterModal = false"></div>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Filtres avancés
              </h3>
              <div class="mt-4 space-y-4">
                <!-- Filtres par catégorie -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Catégories</label>
                  <select 
                    v-model="filters.category"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Toutes les catégories</option>
                    <option v-for="category in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
                
                <!-- Filtre par produit -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Produit</label>
                  <input 
                    type="text" 
                    v-model="filters.productSearch"
                    placeholder="Rechercher un produit"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  >
                </div>
                
                <!-- Filtre par plage de dates -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Du</label>
                    <input 
                      type="date" 
                      v-model="filters.startDate"
                      class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Au</label>
                    <input 
                      type="date" 
                      v-model="filters.endDate"
                      class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                  </div>
                </div>
                
                <!-- Filtre par variation de stock -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Type de variation</label>
                  <div class="mt-2 space-x-4 flex">
                    <label class="inline-flex items-center">
                      <input type="checkbox" v-model="filters.showIncrease" class="form-checkbox h-4 w-4 text-blue-600">
                      <span class="ml-2 text-sm text-gray-700">Augmentation</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input type="checkbox" v-model="filters.showDecrease" class="form-checkbox h-4 w-4 text-blue-600">
                      <span class="ml-2 text-sm text-gray-700">Diminution</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            @click="applyFilters"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Appliquer
          </button>
          <button 
            type="button" 
            @click="resetFilters"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Réinitialiser
          </button>
          <button 
            type="button" 
            @click="showFilterModal = false"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal pour les produits en stock bas -->
  <div v-if="showLowStockModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showLowStockModal = false"></div>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <i class="fas fa-exclamation-triangle text-red-600"></i>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Produits en stock bas
              </h3>
              <div class="mt-4">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produit
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock actuel
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seuil d'alerte
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="product in lowStockProducts" :key="product.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <img :src="product.imageUrl || 'https://via.placeholder.com/40x40'" :alt="product.name" class="h-10 w-10 rounded-md object-cover">
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900 truncate max-w-xs">{{ product.name }}</div>
                              <div class="text-sm text-gray-500">{{ product.category || 'Non catégorisé' }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div :class="[product.stock <= product.threshold/2 ? 'text-red-600' : 'text-yellow-600', 'text-sm font-bold']">
                            {{ product.stock }}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ product.threshold }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            @click="editProduct(product)"
                            class="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <i class="fas fa-edit mr-1"></i> Éditer
                          </button>
                          <button
                            @click="replenishStock(product)"
                            class="text-green-600 hover:text-green-900"
                          >
                            <i class="fas fa-plus-circle mr-1"></i> Réapprovisionner
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            @click="showLowStockModal = false"
            class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Fermer
          </button>
          <button 
            type="button" 
            @click="exportLowStockReport"
            class="mt-3 w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            <i class="fas fa-file-export mr-2"></i> Exporter le rapport
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, watch } from 'vue';
import Chart from 'chart.js/auto';
import axiosInstance from '@/services/api';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps({
  productId: {
    type: String,
    default: ''
  }
});

// Variables pour le rendu et le contrôle
const loading = ref(true);
const error = ref(false);
const stockChart = ref(null);
const chartInstance = ref(null);
const showFilterModal = ref(false);
const showLowStockModal = ref(false);
const selectedPeriod = ref('30');
const debug = ref(true); // Activer le mode debug
const debugInfo = ref('Initialisation...'); // Message de débogage

// Données
const stockHistory = ref([]);
const categories = ref([]);
const lowStockProducts = ref([]);

// Filtres
const filters = ref({
  category: '',
  productSearch: '',
  startDate: '',
  endDate: '',
  showIncrease: true,
  showDecrease: true
});

// Récupérer l'historique des stocks
const fetchStockHistory = async () => {
  try {
    loading.value = true;
    error.value = false;
    
    // Construction des paramètres de la requête
    const params = {
      period: selectedPeriod.value
    };
    
    if (filters.value.category) params.category = filters.value.category;
    if (filters.value.productSearch) params.productSearch = filters.value.productSearch;
    if (filters.value.startDate) params.startDate = filters.value.startDate;
    if (filters.value.endDate) params.endDate = filters.value.endDate;
    if (!filters.value.showIncrease) params.hideIncrease = true;
    if (!filters.value.showDecrease) params.hideDecrease = true;
    
    const response = await axiosInstance.get('/stock-history/evolution', { params });
    console.log('Response from API:', response.data); // Afficher les données brutes pour debug
    
    // Stocker directement les données de l'API sans chercher .stockHistory
    stockHistory.value = response.data;
    
    // Récupérer les catégories distinctes
    const categoriesResponse = await axiosInstance.get('/products/categories');
    categories.value = categoriesResponse.data;
    
    // Récupérer les produits en stock bas
    const lowStockResponse = await axiosInstance.get('/stock-history/low-stock');
    lowStockProducts.value = lowStockResponse.data;
    
    updateChartData();
  } catch (error) {
    console.error('Error fetching stock history:', error);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// Mettre à jour les données du graphique
const updateChartData = () => {
  // Afficher le contenu de stockHistory pour débogage
  console.log('updateChartData - stockHistory:', stockHistory.value);
  debugInfo.value = `Mise à jour des données du graphique: ${new Date().toLocaleTimeString()}`;
  
  // Vérifier si les données existent
  if (!stockHistory.value) {
    console.error('Données manquantes: stockHistory est null ou undefined');
    debugInfo.value = 'Erreur: Données manquantes (stockHistory null)';
    return;
  }
  
  // Vérifier si les données sont dans le nouveau format (avec labels et datasets)
  if (stockHistory.value.labels && stockHistory.value.datasets && Array.isArray(stockHistory.value.datasets)) {
    console.log('Utilisation du format direct avec labels et datasets');
    debugInfo.value = `Format direct: ${stockHistory.value.labels.length} jours, ${stockHistory.value.datasets.length} produits`;
    
    // Utiliser directement le format fourni par l'API
    if (chartInstance.value) {
      chartInstance.value.data = stockHistory.value;
      chartInstance.value.update();
      debugInfo.value += ' - Graphique mis à jour';
    } else {
      createChart(stockHistory.value);
      debugInfo.value += ' - Nouveau graphique créé';
    }
  } else if (Array.isArray(stockHistory.value) && stockHistory.value.length > 0) {
    console.log('Utilisation de l\'ancien format - transformation des données');
    // Utiliser l'ancien processeur de données si le format est différent
    const processedData = processChartData(stockHistory.value);
    
    if (chartInstance.value) {
      chartInstance.value.data.labels = processedData.labels;
      chartInstance.value.data.datasets = processedData.datasets;
      chartInstance.value.update();
    } else {
      createChart(processedData);
    }
  } else {
    // Cas où stockHistory n'est ni un tableau ni un objet avec labels/datasets
    console.error('Format de données non reconnu:', typeof stockHistory.value, stockHistory.value);
    
    // Tenter d'utiliser directement les données si elles semblent valides
    if (typeof stockHistory.value === 'object' && stockHistory.value !== null) {
      try {
        createChart(stockHistory.value);
      } catch (e) {
        console.error('Erreur lors de la création du graphique:', e);
      }
    }
  }
};

// Traiter les données pour le graphique (ancienne méthode)
const processChartData = (data) => {
  // Regrouper les données par date et par produit
  const productData = {};
  const allDates = new Set();
  
  data.forEach(entry => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    allDates.add(date);
    
    if (!productData[entry.productId]) {
      productData[entry.productId] = {
        label: entry.productName,
        data: {},
        borderColor: getRandomColor(),
        tension: 0.3,
        fill: false
      };
    }
    
    productData[entry.productId].data[date] = entry.stock;
  });
  
  // Convertir en format adapté pour Chart.js
  const sortedDates = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));
  const datasets = Object.values(productData).map(product => {
    return {
      label: product.label,
      data: sortedDates.map(date => product.data[date] || null),
      borderColor: product.borderColor,
      tension: product.tension,
      fill: product.fill
    };
  });
  
  return {
    labels: sortedDates,
    datasets
  };
};

// Créer le graphique
const createChart = (data) => {
  console.log('createChart - données reçues:', data);
  debugInfo.value = 'Création du graphique...';
  
  if (!stockChart.value) {
    console.error('Element canvas stockChart introuvable');
    debugInfo.value = 'Erreur: Canvas introuvable';
    return;
  }
  
  try {
    const ctx = stockChart.value.getContext('2d');
    
    // Vérifier que les données sont dans le bon format
    if (!data.labels || !data.datasets) {
      console.error('Données de graphique invalides:', data);
      debugInfo.value = 'Erreur: Format de données invalide';
      return;
    }
    
    debugInfo.value = `Création avec ${data.labels.length} labels et ${data.datasets.length} datasets`;
    
    // S'assurer que les étiquettes des produits sont correctes et ajouter les propriétés manquantes
    const datasets = data.datasets.map((dataset, index) => {
      // Créer une copie du dataset pour éviter de modifier l'original
      const newDataset = { ...dataset };
      
      // Si c'est toujours "Invox" comme étiquette, essayer de récupérer un nom plus descriptif
      if (newDataset.label === "Invox" && newDataset.productId) {
        // Chercher si on a un produit correspondant dans nos listes
        const product = lowStockProducts.value.find(p => p.id == newDataset.productId);
        if (product) {
          newDataset.label = product.name;
        } else {
          newDataset.label = `Produit #${newDataset.productId}`;
        }
      }
      
      // S'assurer que les propriétés obligatoires sont présentes
      if (!newDataset.backgroundColor) {
        const hue = (index * 137) % 360;
        newDataset.backgroundColor = `hsla(${hue}, 70%, 60%, 0.2)`;
        newDataset.borderColor = newDataset.borderColor || `hsla(${hue}, 70%, 50%, 1)`;
      }
      
      // S'assurer que la tension est définie
      newDataset.tension = newDataset.tension || 0.4;
      
      // S'assurer que le borderWidth est défini
      newDataset.borderWidth = newDataset.borderWidth || 2;
      
      // Supprimer la propriété fill si elle n'est pas définie explicitement
      if (!('fill' in newDataset)) {
        newDataset.fill = false;
      }
      
      return newDataset;
    });
    
    // Si un graphique existe déjà, le détruire
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }
    
    // Créer un nouveau graphique
    chartInstance.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function(tooltipItems) {
                return 'Date: ' + tooltipItems[0].label;
              },
              label: function(context) {
                return `${context.dataset.label}: ${context.raw !== null && context.raw !== undefined ? context.raw : 'Aucune donnée'}`;
              }
            }
          },
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              usePointStyle: true
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Stock'
            }
          }
        }
      }
    });
    
    debugInfo.value = `Graphique créé avec succès avec ${datasets.length} produits`;
  } catch (e) {
    console.error('Erreur lors de la création du graphique:', e);
    debugInfo.value = `Erreur: ${e.message}`;
  }
};

// Générer une couleur aléatoire
const getRandomColor = () => {
  const colors = [
    '#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F',
    '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Appliquer les filtres
const applyFilters = () => {
  showFilterModal.value = false;
  fetchStockHistory();
};

// Réinitialiser les filtres
const resetFilters = () => {
  filters.value = {
    category: '',
    productSearch: '',
    startDate: '',
    endDate: '',
    showIncrease: true,
    showDecrease: true
  };
  fetchStockHistory();
};

// Éditer un produit
const editProduct = (product) => {
  // Navigation vers la page d'édition du produit
  // router.push(`/admin/products/edit/${product.id}`);
  showLowStockModal.value = false;
};

// Réapprovisionner un produit
const replenishStock = (product) => {
  // Implémenter la logique de réapprovisionnement
  console.log('Réapprovisionner:', product);
  // Exemple: ouvrir un modal de réapprovisionnement
};

// Exporter le rapport de stock bas
const exportLowStockReport = () => {
  // Implémenter l'export du rapport (CSV ou PDF)
  console.log('Export du rapport de stock bas');
  
  // Exemple de génération CSV
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Produit,Stock actuel,Seuil d'alerte,Catégorie\n";
  
  lowStockProducts.value.forEach(product => {
    csvContent += `"${product.name}",${product.stock},${product.threshold},"${product.category || 'Non catégorisé'}"\n`;
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `rapport_stock_bas_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Surveillance des changements de période
watch(selectedPeriod, () => {
  fetchStockHistory();
});

// Appeler fetchStockHistory lorsque le composant est monté
onMounted(() => {
  console.log('Component mounted');
  debugInfo.value = 'Composant monté, chargement des données...';
  fetchStockHistory();
});

// Observer les changements de la référence au canvas
onUpdated(() => {
  if (stockChart.value && !chartInstance.value) {
    console.log('Canvas disponible après mise à jour');
    debugInfo.value = 'Canvas disponible - vérification des données';
    // Réessayer de créer le graphique si les données sont disponibles
    if (stockHistory.value && stockHistory.value.labels) {
      createChart(stockHistory.value);
    }
  }
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}
</style>
