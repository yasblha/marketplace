<template>
  <div>
    <button class="add-order-button" @click="handleAddOrderClick">Add Order</button>

    <Table
        :items="orders"
        :columns="columns"
        :itemsPerPage="10"
        @view="viewOrder"
        @edit="editOrder"
        @delete="deleteOrder"
    />

    <Modal v-model="showOrderModal" :title="modalTitle">
      <AddOrderForm
          :initialData="selectedOrder || undefined"
          @order-added="onOrderAdded"
          @order-updated="onOrderUpdated"
      />
    </Modal>

    <Modal v-model="showOrderDetailsModal" :title="`Order ID: ${selectedOrder?.id}`">
      <div class="order-details-modal">
        <div class="info-section">
          <h3 class="order-details-title">Order Details</h3>
          <p><strong>Date:</strong> {{ selectedOrder?.dateOrder }}</p>
          <p><strong>Status:</strong> {{ selectedOrder?.statusOrder }}</p>
          <p><strong>Total Amount:</strong> {{ selectedOrder?.totalAmount }} €</p>
          <p><strong>Customer Name:</strong> {{ selectedOrder?.User.firstname }} {{ selectedOrder?.User.lastname }}</p>
          <p><strong>Products:</strong></p>
          <table class="product-table">
            <thead>
            <tr>
              <th>Product Name</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="product in selectedOrder?.OrderDetails" :key="product.productName">
              <td>{{ product.productName }}</td>
              <td>{{ product.unitPrice }} €</td>
              <td>{{ product.quantity }}</td>
              <td>{{ (product.unitPrice * product.quantity).toFixed(2) }} €</td>
            </tr>
            </tbody>
          </table>
          <button @click="downloadInvoice" class="download-button">Download Invoice</button>
        </div>
      </div>
    </Modal>

    <Modal v-if="showErrorModal" v-model="showErrorModal" title="Error">
      <div class="error-modal">
        <p>Your cart is empty. Please add products to your cart before proceeding.</p>
        <button @click="closeErrorModal">OK</button>
      </div>
    </Modal>

    <!-- Hidden invoice template for printing -->
    <div id="invoice-template" class="invoice-template" ref="invoiceTemplate" style="display: none;">
      <h1>Invoice</h1>
      <p><strong>Order ID:</strong> {{ selectedOrder?.id }}</p>
      <p><strong>Date:</strong> {{ selectedOrder?.dateOrder }}</p>
      <p><strong>Status:</strong> {{ selectedOrder?.statusOrder }}</p>
      <p><strong>Total Amount:</strong> {{ selectedOrder?.totalAmount }} €</p>
      <p><strong>Customer Name:</strong> {{ selectedOrder?.User.firstname }} {{ selectedOrder?.User.lastname }}</p>
      <table class="invoice-table">
        <thead>
        <tr>
          <th>Product Name</th>
          <th>Unit Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in selectedOrder?.OrderDetails" :key="product.productName">
          <td>{{ product.productName }}</td>
          <td>{{ product.unitPrice }} €</td>
          <td>{{ product.quantity }}</td>
          <td>{{ (product.unitPrice * product.quantity).toFixed(2) }} €</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useOrderStore } from '@/stores/Commande';
import { useCartStore } from '@/stores/panier';
import Table from '@/components/common/Table.vue';
import Modal from '@/components/common/Modale.vue';
import AddOrderForm from '@/components/common/AddOrderForm.vue';
import jsPDF from 'jspdf';

interface Order {
  id: number;
  dateOrder: string;
  statusOrder: string;
  totalAmount: number;
  OrderDetails: {
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
  User: {
    firstname: string;
    lastname: string;
  };
  userId: number;
}

interface Column<T> {
  key: keyof T & string;
  label: string;
  formatter?: (value: any) => string;
  searchable?: boolean;
}

const orderStore = useOrderStore();
const cartStore = useCartStore();
const showOrderModal = ref(false);
const showOrderDetailsModal = ref(false);
const showErrorModal = ref(false);
const selectedOrder = ref<Partial<Order> | null>(null);

const orders = computed(() => orderStore.orders);
const modalTitle = computed(() => (selectedOrder.value ? 'Edit Order' : 'Add Order'));

const columns: Column<Order>[] = [
  { key: 'id', label: 'Order ID' },
  { key: 'dateOrder', label: 'Date', searchable: true },
  { key: 'statusOrder', label: 'Status', searchable: true },
  { key: 'totalAmount', label: 'Total Amount' }
];

onMounted(async () => {
  await orderStore.fetchOrders();
});

const handleAddOrderClick = () => {
  if (cartStore.items.length === 0) {
    showErrorModal.value = true;
  } else {
    showOrderModal.value = true;
  }
};

const viewOrder = async (order: Order) => {
  selectedOrder.value = await orderStore.fetchOrderById(order.id);
  showOrderDetailsModal.value = true;
};

const editOrder = async (order: Order) => {
  selectedOrder.value = await orderStore.fetchOrderById(order.id);
  showOrderModal.value = true;
};

const deleteOrder = async (order: Order) => {
  if (confirm('Are you sure you want to delete this order?')) {
    try {
      await orderStore.deleteOrder(order.id);
      await orderStore.fetchOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  }
};

const onOrderAdded = async () => {
  showOrderModal.value = false;
  await orderStore.fetchOrders();
};

const onOrderUpdated = async () => {
  showOrderModal.value = false;
  selectedOrder.value = null;
  await orderStore.fetchOrders();
};

const closeErrorModal = () => {
  showErrorModal.value = false;
};

const downloadInvoice = () => {
  const doc = new jsPDF();
  const order = selectedOrder.value;
  if (!order) return;

  doc.setFontSize(20);
  doc.text("Invoice", 20, 20);

  doc.setFontSize(12);
  doc.text(`Order ID: ${order.id}`, 20, 30);
  doc.text(`Date: ${order.dateOrder}`, 20, 40);
  doc.text(`Status: ${order.statusOrder}`, 20, 50);
  doc.text(`Total Amount: ${order.totalAmount} €`, 20, 60);
  doc.text(`Customer Name: ${order.User.firstname} ${order.User.lastname}`, 20, 70);

  const startY = 80;
  const lineSpacing = 10;

  doc.text("Products:", 20, startY);
  let currentY = startY + lineSpacing;

  order.OrderDetails.forEach(product => {
    doc.text(`Product Name: ${product.productName}`, 20, currentY);
    doc.text(`Unit Price: ${product.unitPrice} €`, 20, currentY + lineSpacing);
    doc.text(`Quantity: ${product.quantity}`, 20, currentY + 2 * lineSpacing);
    doc.text(`Total: ${(product.unitPrice * product.quantity).toFixed(2)} €`, 20, currentY + 3 * lineSpacing);
    currentY += 4 * lineSpacing;
  });

  doc.save(`invoice_${order.id}.pdf`);
};
</script>


<style scoped>
.add-order-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.add-order-button:hover {
  background-color: #0056b3;
}

.order-details-modal {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.info-section {
  flex: 2;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.order-details-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.order-details-modal p {
  margin: 10px 0;
  color: #333;
}

.order-details-modal strong {
  color: #555;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.product-table th, .product-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.product-table th {
  background-color: #f2f2f2;
  color: #333;
}

.product-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.product-table tr:hover {
  background-color: #ddd;
}

.download-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 0;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.download-button:hover {
  background-color: #218838;
}

.invoice-template {
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.invoice-template h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.invoice-table th, .invoice-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.invoice-table th {
  background-color: #f2f2f2;
  color: #333;
}

.invoice-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.invoice-table tr:hover {
  background-color: #ddd;
}
</style>
