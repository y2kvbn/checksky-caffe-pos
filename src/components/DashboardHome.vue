<template>
  <div class="dashboard-home">
    
    <!-- Main Header -->
    <div class="main-header">
      <h2>即時訂單總覽</h2>
      <div class="header-actions">
        <button class="btn btn-primary" @click="$emit('setView', 'pos')">
          <i class="fas fa-utensils"></i> 前往點餐
        </button>
        <button class="btn btn-danger">
          <i class="fas fa-chart-line"></i> 每日結算
        </button>
      </div>
    </div>

    <!-- Metrics -->
    <div class="metrics">
       <div class="metric-card">
        <div class="metric-header"><span>已結帳總額</span><i class="fas fa-dollar-sign"></i></div>
        <div class="metric-value">NT${{ totalRevenue }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-header"><span>未結帳金額</span><i class="fas fa-file-invoice-dollar"></i></div>
        <div class="metric-value">NT${{ pendingRevenue }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-header"><span>總訂單數</span><i class="fas fa-receipt"></i></div>
        <div class="metric-value">{{ totalOrdersCount }}</div>
      </div>
    </div>

    <!-- Orders Grid -->
    <div class="orders-container">
      <div v-if="orders.length === 0" class="no-orders">
        <!-- Intentionally blank as per user request -->
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
      </div>
    </div>

    <!-- Print Modal, teleported to body for clean printing -->
    <Teleport to="body">
      <div v-if="showPrintModal" class="print-modal-overlay" @click.self="closePrintPreview">
        <div class="print-modal-content">
          <div class="print-modal-header">
            <h3>訂單收據預覽</h3>
            <button @click="closePrintPreview" class="close-btn">&times;</button>
          </div>
          <div class="print-modal-body" id="printable-area">
            <PrintReceipt v-if="selectedOrderForPrint" :order="selectedOrderForPrint" />
          </div>
          <div class="print-modal-footer">
            <button @click="closePrintPreview" class="btn btn-grey">取消</button>
            <button @click="handlePrint" class="btn btn-primary"><i class="fas fa-print"></i> 確認列印</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useOrdersStore } from '../stores/orders';
import { storeToRefs } from 'pinia';
import PrintReceipt from './PrintReceipt.vue';

const emit = defineEmits(['setView']);
const ordersStore = useOrdersStore();

const { orders, totalRevenue, pendingRevenue, totalOrdersCount } = storeToRefs(ordersStore);
const showPrintModal = ref(false);
const selectedOrderForPrint = ref(null);

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
};

const updateStatus = (order, newStatus) => {
    ordersStore.updateOrderStatus(order.id, newStatus);
};

const openPrintPreview = (order) => {
  selectedOrderForPrint.value = order;
  showPrintModal.value = true;
};

const closePrintPreview = () => {
  showPrintModal.value = false;
  selectedOrderForPrint.value = null;
};

const handlePrint = () => {
  window.print();
};

</script>

<!-- Global styles for clean printing. Not scoped. -->
<style>
@media print {
  /* Hide the main app, only the teleported modal will be a direct child of body */
  body > #app {
    display: none;
  }

  /* Reset the print modal styles to be just a container */
  .print-modal-overlay {
    position: static;
    background: transparent;
    display: block; 
  }
  
  .print-modal-content {
    box-shadow: none;
    border: none;
    width: 100%;
    border-radius: 0;
    padding: 0;
    margin: 0;
  }

  /* Hide the modal's header and footer, only the body (receipt) should print */
  .print-modal-header, .print-modal-footer {
    display: none;
  }

  /* Ensure the body takes up the full space */
  .print-modal-body {
    padding: 0;
    margin: 0;
    max-height: none;
    overflow: visible;
    background-color: white;
  }
}
</style>

<style scoped>
/* --- Base & Layout -- */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.main-header h2 { 
  font-size: 28px; 
  color: #333; 
  font-weight: bold;
  margin: 0;
}

.header-actions {
    display: flex;
    gap: 20px;
}

.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px; }
.orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

.btn { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-weight: bold; 
  border-radius: 8px; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  border:none; 
  padding: 10px 20px; /* Default padding */
}

/* Larger buttons for header actions */
.header-actions .btn {
  padding: 14px 28px;
  font-size: 16px;
}

.btn-primary { background-color: #ff6b6b; color: white; }
.btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
.btn-danger { background-color: #555; color: white; }
.btn-danger:hover { background-color: #333; transform: translateY(-2px); }
.btn-grey { background-color: #ccc; color: #333; }

/* --- Cards --- */
.metric-card, .order-card { background-color: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.metric-card { padding: 20px; }
.metric-header { display: flex; justify-content: space-between; align-items: center; color: #777; margin-bottom: 10px; }
.metric-header i { font-size: 22px; color: #aaa; }
.metric-value { font-size: 32px; font-weight: bold; color: #333; }

/* --- Order Cards --- */
.order-card { border-left: 5px solid; display: flex; flex-direction: column; }
.order-card.status-處理中 { border-color: #f59e0b; } 
.order-card.status-已完成 { border-color: #22c55e; }
.order-card.status-已取消 { border-color: #ef4444; }

.order-card-header { display: flex; justify-content: space-between; padding: 10px 15px; background-color: #f9fafb; border-bottom: 1px solid #f0f0f0; }
.order-id { font-weight: bold; }
.order-status { font-size: 12px; font-weight: bold; padding: 3px 8px; border-radius: 99px; color: #fff; }
.status-處理中 .order-status { background-color: #f59e0b; }
.status-已完成 .order-status { background-color: #22c55e; }
.status-已取消 .order-status { background-color: #ef4444; }

.order-card-body { padding: 15px; flex-grow: 1; }
.order-items { margin-bottom: 15px; }
.order-item { display: flex; justify-content: space-between; font-size: 14px; padding: 4px 0; }
.order-details p { margin: 5px 0; font-size: 14px; color: #777; display: flex; align-items: center; gap: 8px;}
.order-details p:first-of-type { font-weight: bold; color: #333; }
.order-details p.total { font-size: 16px; font-weight: bold; color: #333; margin-top: 10px; }

.order-card-actions { display: flex; gap: 10px; padding: 10px 15px; background-color: #f9fafb; border-top: 1px solid #f0f0f0; justify-content: flex-end; }
.btn-sm { padding: 5px 12px; font-size: 12px; gap: 5px; }
.btn-success { background-color: #22c55e; color: #fff; }
.btn-warning { background-color: #f59e0b; color: #fff; }
.btn-info { background-color: #3b82f6; color: #fff; }
.btn-secondary { background-color: #6c757d; color: #fff; }

/* --- No Orders --- */
.no-orders { 
  padding: 20px;
}

/* --- Print Modal (On-screen styles) --- */
.print-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.print-modal-content { background: #fff; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 340px; overflow: hidden; animation: fadeIn 0.3s ease-out; }
.print-modal-header { padding: 15px 20px; background: #f7f7f7; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.print-modal-header h3 { margin: 0; font-size: 18px; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #888; }
.print-modal-body { padding: 10px; max-height: 60vh; overflow-y: auto; background-color: #f0f2f5; }
.print-modal-footer { padding: 15px 20px; background: #f7f7f7; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px; }

@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

</style>