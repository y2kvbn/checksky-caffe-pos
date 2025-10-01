<template>
  <div class="order-card" :class="`status-${order.status.toLowerCase()}`">
    <div class="order-card-header">
      <div class="order-title-group">
        <span class="order-id">訂單 #{{ formattedOrderIndex }}</span>
        <span class="order-status">{{ order.status }}</span>
      </div>
      <button class="btn-delete" @click.stop="$emit('delete-order', order.id)">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
    <div class="order-card-body">
      <!-- [REFACTORED] Order items rendering with hierarchy -->
      <div class="order-items">
        <div v-for="item in order.items" :key="item.id" class="order-item-wrapper">
          <!-- Main Item -->
          <div class="order-item main-item">
            <span>{{ item.name }}</span>
            <span>x {{ item.quantity }}</span>
          </div>
          <!-- Sub Items (for set meals) -->
          <div v-if="item.subItems && item.subItems.length > 0" class="sub-items-list">
            <div v-for="(subItem, index) in item.subItems" :key="index" class="order-item sub-item">
              <span>└ {{ subItem.name }}</span>
              <span v-if="!subItem.isGift">x {{ subItem.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="order-details">
        <div class="order-meta">
          <p><strong><i class="fas fa-chair"></i></strong> {{ order.tableNumber || '未指定' }}</p>
          <p><strong><i class="far fa-clock"></i></strong> {{ formatTime(order.timestamp) }}</p>
          <p><strong><i class="far fa-credit-card"></i></strong> {{ order.paymentMethod === 'cash' ? '現金' : 'LinePay' }}</p>
        </div>
        <p class="total"><strong>總金額:</strong> NT${{ order.total }}</p>
      </div>
    </div>
    <div class="order-card-actions">
      <div class="action-buttons">
        <button v-if="order.status === '處理中'" class="btn btn-sm btn-success" @click="updateStatus(order.id, '已完成')">完成</button>
        <button v-if="order.status === '處理中'" class="btn btn-sm btn-warning" @click="updateStatus(order.id, '已取消')">取消</button>
        <button v-if="order.status !== '處理中'" class="btn btn-sm btn-info" @click="updateStatus(order.id, '處理中')">恢復</button>
        <button class="btn btn-sm btn-secondary" @click="$emit('openPrintPreview', order)"><i class="fas fa-print"></i> 列印</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Order } from '../stores/orders';
import { useOrdersStore } from '../stores/orders';

const props = defineProps<{ 
  order: Order,
  orderIndex: number
}>();

const emit = defineEmits(['openPrintPreview', 'delete-order']);

const ordersStore = useOrdersStore();

const formattedOrderIndex = computed(() => {
  return (props.orderIndex + 1).toString().padStart(3, '0');
});

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
};

const updateStatus = (orderId: string, newStatus: Order['status']) => {
  ordersStore.updateOrderStatus(orderId, newStatus);
};
</script>

<style scoped>
.order-card {
  border-left: 5px solid;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out;
}

.order-card:hover {
  transform: translateY(-3px);
}

.order-card.status-處理中 { border-color: #f59e0b; }
.order-card.status-已完成 { border-color: #22c55e; }
.order-card.status-已取消 { border-color: #ef4444; }

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px; /* Slightly increased padding */
  background-color: #f9fafb;
  border-bottom: 1px solid #f0f0f0;
}

.order-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-id {
  font-weight: bold;
  font-size: 18px; /* Increased font size */
  color: #555;
}

.btn-delete {
  background: transparent;
  border: none;
  color: #e57373;
  cursor: pointer;
  padding: 8px; /* Increased padding */
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s;
  font-size: 18px; /* Increased icon size */
}

.btn-delete:hover {
  background-color: #ffebee;
  color: #d32f2f;
}

.order-card-body {
  padding: 15px;
  flex-grow: 1;
}

.order-items { 
  margin-bottom: 15px; 
}

/* [NEW] Wrapper for each item/set meal */
.order-item-wrapper {
  padding: 5px 0;
  border-bottom: 1px solid #f5f5f5;
}
.order-item-wrapper:last-child {
  border-bottom: none;
}

.order-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.main-item {
  font-weight: 600;
}

.sub-items-list {
  padding-left: 15px;
  margin-top: 5px;
}

.sub-item {
  font-size: 13px;
  color: #666;
}


.order-details {
    border-top: 1px solid #f0f0f0;
    padding-top: 15px;
    margin-top: 15px;
}

.order-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-meta p {
  margin: 0; /* Remove default margin */
  font-size: 14px;
  color: #777;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-details p.total {
  font-size: 18px; /* Increased font size */
  font-weight: bold;
  color: #333;
  margin: 0;
  text-align: center; /* Centered text */
}

.order-card-actions {
  display: flex;
  justify-content: flex-end; /* Modified for right alignment */
  align-items: center;
  padding: 10px 15px;
  background-color: #f9fafb;
  border-top: 1px solid #f0f0f0;
}

.order-status {
  font-size: 16px; /* Increased font size */
  font-weight: bold;
  padding: 6px 14px; /* Increased padding */
  border-radius: 99px;
  color: #fff;
}

.status-處理中 .order-status { background-color: #f59e0b; }
.status-已完成 .order-status { background-color: #22c55e; }
.status-已取消 .order-status { background-color: #ef4444; }

.action-buttons {
  display: flex;
  gap: 15px; /* Increased gap for better spacing */
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-sm {
  padding: 10px 18px; /* Significantly increased padding */
  font-size: 16px;   /* Increased font size for readability */
}

.btn-success { background-color: #28a745; color: #fff; }
.btn-warning { background-color: #ffc107; color: #333; }
.btn-info { background-color: #17a2b8; color: #fff; }
.btn-secondary { background-color: #6c757d; color: #fff; }
</style>