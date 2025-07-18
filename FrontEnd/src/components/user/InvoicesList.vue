<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-medium text-gray-900">Mes Factures</h3>
    </div>
    
    <!-- État de chargement -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Message si aucune facture -->
    <div v-else-if="!invoices.length" class="py-8 text-center">
      <div class="mb-4">
        <i class="fas fa-file-invoice text-4xl text-gray-300"></i>
      </div>
      <h4 class="text-gray-500 text-lg">Aucune facture disponible</h4>
      <p class="text-gray-400 mt-2">Vos factures apparaîtront ici une fois vos commandes livrées</p>
    </div>
    
    <!-- Liste des factures -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              N° Commande
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              État
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="invoice in invoices" :key="invoice.orderId">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{{ invoice.orderId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(invoice.orderDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatPrice(invoice.amount) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(invoice.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ getStatusLabel(invoice.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button 
                v-if="invoice.invoiceExists" 
                @click="downloadInvoice(invoice.orderId)"
                class="text-blue-600 hover:text-blue-900 flex items-center"
                :disabled="downloadingId === invoice.orderId"
              >
                <i class="fas fa-download mr-1"></i> 
                <span v-if="downloadingId !== invoice.orderId">Télécharger</span>
                <span v-else>En cours...</span>
              </button>
              <button 
                v-if="invoice.invoiceExists" 
                @click="sendInvoiceByEmail(invoice.orderId)"
                class="text-green-600 hover:text-green-900 flex items-center ml-3"
                :disabled="sendingId === invoice.orderId"
              >
                <i class="fas fa-envelope mr-1"></i> 
                <span v-if="sendingId !== invoice.orderId">Par email</span>
                <span v-else>Envoi...</span>
              </button>
              <span v-if="!invoice.invoiceExists" class="text-gray-400">
                Facture en préparation
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/user';
import { useToast } from '@/composables/useToast';
import axiosInstance from '@/services/api';

// Types
interface Invoice {
  orderId: number | string;
  orderDate: string;
  amount: number;
  status: string;
  paymentStatus: string;
  invoiceExists: boolean;
}

// Stores et composables
const authStore = useAuthStore();
const { showToast } = useToast();

// État
const invoices = ref<Invoice[]>([]);
const loading = ref(true);
const downloadingId = ref<number | string | null>(null);
const sendingId = ref<number | string | null>(null);

// Récupérer la liste des factures
const fetchInvoices = async () => {
  try {
    loading.value = true;
    
    const response = await axiosInstance.get('/invoices/user');
    
    invoices.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des factures:', error);
    showToast('Erreur lors du chargement des factures', 'error');
  } finally {
    loading.value = false;
  }
};

// Télécharger une facture
const downloadInvoice = async (orderId: number | string) => {
  try {
    downloadingId.value = orderId;
    
    const response = await axiosInstance.get(`/invoices/order/${orderId}`, {
      responseType: 'blob'
    });
    
    // Créer un lien de téléchargement pour le PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `facture-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Facture téléchargée avec succès', 'success');
  } catch (error) {
    console.error('Erreur lors du téléchargement de la facture:', error);
    showToast('Erreur lors du téléchargement de la facture', 'error');
  } finally {
    downloadingId.value = null;
  }
};

// Envoyer une facture par email
const sendInvoiceByEmail = async (orderId: number | string) => {
  try {
    sendingId.value = orderId;
    
    await axiosInstance.post(`/invoices/order/${orderId}/send-email`, {});
    
    showToast('Facture envoyée par email avec succès', 'success');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la facture par email:', error);
    showToast('Erreur lors de l\'envoi de la facture par email', 'error');
  } finally {
    sendingId.value = null;
  }
};

// Formater une date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

// Formater un prix
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

// Obtenir une classe CSS en fonction du statut
const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'processing':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Obtenir un libellé en fonction du statut
const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'Terminée';
    case 'delivered':
      return 'Livrée';
    case 'processing':
      return 'En traitement';
    case 'pending':
      return 'En attente';
    case 'cancelled':
      return 'Annulée';
    default:
      return status;
  }
};

// Initialiser le composant
onMounted(() => {
  fetchInvoices();
});
</script>
