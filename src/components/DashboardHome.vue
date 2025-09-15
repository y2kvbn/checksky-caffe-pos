<template>
  <div class="dashboard-home">
    <div class="main-header">
      <h2>即時訂單總覽</h2>
      <div class="header-actions">
        <button class="btn btn-primary" @click="$emit('setView', 'pos')"><span>&#127869;</span> 前往點餐</button>
        <button class="btn btn-danger"><span>&#128187;</span> 每日結算</button>
      </div>
    </div>
    <div class="metrics">
      <div class="metric-card">
        <div class="metric-header">
          <span>已結帳總額</span>
          <span>$</span>
        </div>
        <div class="metric-value">NT${{ totalRevenue }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-header">
          <span>未結帳金額</span>
          <span>&#128179;</span>
        </div>
        <div class="metric-value">NT${{ pendingRevenue }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-header">
          <span>總訂單數</span>
          <span>&#128190;</span>
        </div>
        <div class="metric-value">{{ totalOrdersCount }}</div>
      </div>
    </div>
    <div class="orders-container">
      <div v-if="orders.length === 0" class="no-orders">
        <p>目前沒有訂單</p>
      </div>
      <div v-else class="orders-grid">
        <div v-for="order in orders" :key="order.id" class="order-card" :class="`status-${order.status.toLowerCase()}`">
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
              <p><strong>時間:</strong> {{ formatTime(order.timestamp) }}</p>
              <p><strong>付款方式:</strong> {{ order.paymentMethod === 'cash' ? '現金' : 'LinePay' }}</p>
              <p class="total"><strong>總金額:</strong> NT${{ order.total }}</p>
            </div>
          </div>
          <div class="order-card-actions">
            <button v-if="order.status === '處理中'" class="btn btn-sm btn-success" @click="updateStatus(order, '已完成')">完成訂單</button>
            <button v-if="order.status === '處理中'" class="btn btn-sm btn-warning" @click="updateStatus(order, '已取消')">取消訂單</button>
            <button v-if="order.status !== '處理中'" class="btn btn-sm btn-info" @click="updateStatus(order, '處理中')">恢復訂單</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrdersStore } from '../stores/orders';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['setView']);
const ordersStore = useOrdersStore();

const { orders, totalRevenue, pendingRevenue, totalOrdersCount } = storeToRefs(ordersStore);

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
};

const updateStatus = (order, newStatus) => {
    ordersStore.updateOrderStatus(order.id, newStatus);
};

</script>

<style scoped>
/* Existing styles plus new order card styles */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.main-header h2 {
    margin: 0;
    font-size: 24px;
    color: var(--text-dark);
}

.header-actions {
    display: flex;
    gap: 15px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 10px;
}

.metric-header span:last-child {
    font-size: 24px;
    color: var(--text-dark);
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--text-dark);
}

.orders-container {
    background-color: transparent; /* No background for the main container */
}

.no-orders {
  background-color: #fff;
  padding: 80px 20px;
  border-radius: 12px;
  text-align: center;
  color: var(--text-light);
  box-shadow: var(--shadow-soft);
}

.orders-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.order-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: var(--shadow-soft);
    border-left: 5px solid;
    display: flex;
    flex-direction: column;
}

.order-card.status-處理中 { border-color: #f59e0b; } /* Amber 500 */
.order-card.status-已完成 { border-color: #22c55e; } /* Green 500 */
.order-card.status-已取消 { border-color: #ef4444; } /* Red 500 */


.order-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #f9fafb; /* Gray 50 */
    border-bottom: 1px solid var(--border-color);
}

.order-id {
    font-weight: bold;
    color: var(--text-dark);
}

.order-status {
    font-size: 12px;
    font-weight: bold;
    padding: 3px 8px;
    border-radius: 99px;
    color: #fff;
}

.status-處理中 .order-status { background-color: #f59e0b; } 
.status-已完成 .order-status { background-color: #22c55e; }
.status-已取消 .order-status { background-color: #ef4444; }

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
    color: var(--text-light);
}

.order-details p.total {
    font-size: 16px;
    font-weight: bold;
    color: var(--text-dark);
    margin-top: 10px;
}

.order-card-actions {
    display: flex;
    gap: 10px;
    padding: 10px 15px;
    background-color: #f9fafb;
    border-top: 1px solid var(--border-color);
    justify-content: flex-end;
}

.btn-sm {
    padding: 5px 12px;
    font-size: 12px;
}

.btn-success { background-color: #22c55e; color: #fff; }
.btn-warning { background-color: #f59e0b; color: #fff; }
.btn-info { background-color: #3b82f6; color: #fff; }


.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-danger {
    background-color: var(--primary-color);
    color: white;
}

.btn-danger:hover {
    opacity: 0.9;
}
</style>
