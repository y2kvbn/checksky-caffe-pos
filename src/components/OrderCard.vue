<template>
  <div class="order-card" :class="`status-${order.status.toLowerCase()}`">
    <div class="order-card-header">
      <span class="order-id">訂單 #{{ order.id.slice(-6) }}</span>
      <button class="btn-delete" @click.stop="$emit('delete-order', order.id)">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
    <div class="order-card-body">
      <div class="order-items">
        <div v-for="item in order.items" :key="item.id" class="order-item">
          <span>{{ item.name }}</span>
          <span>x {{ item.quantity }}</span>
        </div>
      </div>
      <div class="order-details">
        <p><strong><i class="fas fa-chair"></i></strong> {{ order.tableNumber || '未指定' }}</p>
        <p><strong><i class="far fa-clock"></i></strong> {{ formatTime(order.timestamp) }}</p>
        <p><strong><i class="far fa-credit-card"></i></strong> {{ order.paymentMethod === 'cash' ? '現金' : 'LinePay' }}</p>
        <p class="total"><strong>總金額:</strong> NT${{ order.total }}</p>
      </div>
    </div>
    <div class="order-card-actions">
      <span class="order-status">{{ order.status }}</span>
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
import type { Order } from '../stores/orders';
import { useOrdersStore } from '../stores/orders';

const props = defineProps<{ 
  order: Order 
}>();

const emit = defineEmits(['openPrintPreview', 'delete-order']);

const ordersStore = useOrdersStore();

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
  padding: 10px 15px;
  background-color: #f9fafb;
  border-bottom: 1px solid #f0f0f0;
}

.order-id {
  font-weight: bold;
  font-size: 14px;
  color: #555;
}

.btn-delete {
  background: transparent;
  border: none;
  color: #e57373;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s;
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

.order-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 5px 0;
  border-bottom: 1px solid #f5f5f5;
}

.order-item:last-child {
  border-bottom: none;
}

.order-details p {
  margin: 6px 0;
  font-size: 14px;
  color: #777;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-details p.total {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-top: 12px;
}

.order-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f9fafb;
  border-top: 1px solid #f0f0f0;
}

.order-status {
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 99px;
  color: #fff;
}

.status-處理中 .order-status { background-color: #f59e0b; }
.status-已完成 .order-status { background-color: #22c55e; }
.status-已取消 .order-status { background-color: #ef4444; }

.action-buttons {
  display: flex;
  gap: 10px;
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
  padding: 6px 14px;
  font-size: 12px;
}

.btn-success { background-color: #28a745; color: #fff; }
.btn-warning { background-color: #ffc107; color: #333; }
.btn-info { background-color: #17a2b8; color: #fff; }
.btn-secondary { background-color: #6c757d; color: #fff; }
</style>
