<template>
  <div class="order-card" :class="`status-${order.status.toLowerCase()}`">
    <div class="order-card-header">
      <span class="order-id">訂單 #{{ order.id }}</span>
      <span class="order-status">{{ order.status }}</span>
    </div>
    <div class="order-card-body">
      <div class="order-items">
        <div v-for="item in order.items" :key="item.id" class="order-item">
          <span>{{ item.name }}</span>
          <span>x {{ item.quantity }}</span>
        </div>
      </div>
      <div class="order-details">
        <p><strong><i class="fas fa-chair"></i></strong> {{ order.table || '未指定' }}</p>
        <p><strong><i class="far fa-clock"></i></strong> {{ formatTime(order.timestamp) }}</p>
        <p><strong><i class="far fa-credit-card"></i></strong> {{ order.paymentMethod === 'cash' ? '現金' : 'LinePay' }}</p>
        <p class="total"><strong>總金額:</strong> NT${{ order.total.toFixed(2) }}</p>
      </div>
    </div>
    <div class="order-card-actions">
      <button v-if="order.status === '處理中'" class="btn btn-sm btn-success" @click="updateStatus(order, '已完成')">完成</button>
      <button v-if="order.status === '處理中'" class="btn btn-sm btn-warning" @click="updateStatus(order, '已取消')">取消</button>
      <button v-if="order.status !== '處理中'" class="btn btn-sm btn-info" @click="updateStatus(order, '處理中')">恢復</button>
      <button class="btn btn-sm btn-secondary" @click="openPrintPreview(order)"><i class="fas fa-print"></i> 列印</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '../stores/orders';

const { order } = defineProps<{ order: any }>();

const ordersStore = useOrdersStore();

const formatTime = (date: string | number | Date) => {
  return new Date(date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
};

const updateStatus = (order: { id: any; }, newStatus: any) => {
  ordersStore.updateOrderStatus(order.id, newStatus);
};

const openPrintPreview = (order: any) => {
  // This will be handled by the parent component
  // We just emit an event
  emit('openPrintPreview', order);
};

const emit = defineEmits(['openPrintPreview']);

</script>

<style scoped>
.order-card {
  border-left: 5px solid;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.order-card.status-處理中 {
  border-color: #f59e0b;
}

.order-card.status-已完成 {
  border-color: #22c55e;
}

.order-card.status-已取消 {
  border-color: #ef4444;
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #f9fafb;
  border-bottom: 1px solid #f0f0f0;
}

.order-id {
  font-weight: bold;
}

.order-status {
  font-size: 12px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 99px;
  color: #fff;
}

.status-處理中 .order-status {
  background-color: #f59e0b;
}

.status-已完成 .order-status {
  background-color: #22c55e;
}

.status-已取消 .order-status {
  background-color: #ef4444;
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
  padding: 4px 0;
}

.order-details p {
  margin: 5px 0;
  font-size: 14px;
  color: #777;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-details p:first-of-type {
  font-weight: bold;
  color: #333;
}

.order-details p.total {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
}

.order-card-actions {
  display: flex;
  gap: 10px;
  padding: 10px 15px;
  background-color: #f9fafb;
  border-top: 1px solid #f0f0f0;
  justify-content: flex-end;
}

.btn-sm {
  padding: 5px 12px;
  font-size: 12px;
  gap: 5px;
}

.btn-success {
  background-color: #22c55e;
  color: #fff;
}

.btn-warning {
  background-color: #f59e0b;
  color: #fff;
}

.btn-info {
  background-color: #3b82f6;
  color: #fff;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}
</style>
