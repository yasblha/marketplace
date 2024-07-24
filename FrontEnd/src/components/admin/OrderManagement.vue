<template>
  <div>
    <button class="add-order-button" @click="showOrderModal = true">Add Order</button>

    <Table
        :items="orders"
        :columns="columns"
        :itemsPerPage="10"
        :onView="viewOrder"
        :onEdit="editOrder"
        :onDelete="deleteOrder"
    />

    <Modal v-model="showOrderModal" :title="modalTitle">
      <AddOrderForm
          :initialData="selectedOrder"
          @order-added="onOrderAdded"
          @order-updated="onOrderUpdated"
      />
    </Modal>

    <Modal v-if="showOrderDetailsModal" v-model="showOrderDetailsModal" :title="`Order ID: ${selectedOrder?.id}`">
      <div class="order-details-modal">
        <div class="info-section">
          <h3 class="order-details-title">Order Details</h3>
          <p><strong>Date:</strong> {{ selectedOrder?.date_order }}</p>
          <p><strong>Status:</strong> {{ selectedOrder?.status_order }}</p>
          <p><strong>Total Amount:</strong> {{ selectedOrder?.total_amount }}</p>
          <p><strong>Products:</strong> {{ selectedOrder?.productIds.join(', ') }}</p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useOrderStore } from '@/stores/Commande';
import Table from '@/components/common/Table.vue';
import Modal from '@/components/common/Modale.vue';
import AddOrderForm from '@/components/common/AddOrderForm.vue';

interface Order {
  id: number;
  date_order: Date;
  status_order: string;
  total_amount: number;
  productIds: number[];
  userId: number;
}

interface Column<T> {
  key: keyof T & string;
  label: string;
  searchable?: boolean;
}

const orderStore = useOrderStore();
const showOrderModal = ref(false);
const showOrderDetailsModal = ref(false);
const selectedOrder = ref<Partial<Order> | null>(null);

const orders = computed(() => orderStore.orders);
const modalTitle = computed(() => selectedOrder.value ? 'Edit Order' : 'Add Order');

const columns: Column<Order>[] = [
  { key: 'id', label: 'Order ID' },
  { key: 'date_order', label: 'Date', searchable: true },
  { key: 'status_order', label: 'Status', searchable: true },
  { key: 'total_amount', label: 'Total Amount' },
  { key: 'productIds', label: 'Products' },
];

onMounted(async () => {
  await orderStore.fetchOrders();
});

const viewOrder = (order: Order) => {
  selectedOrder.value = { ...order };
  showOrderDetailsModal.value = true;
};

const editOrder = (order: Order) => {
  selectedOrder.value = { ...order };
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
</style>
