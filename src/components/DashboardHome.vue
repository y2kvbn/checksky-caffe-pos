<template>
  <div class="dashboard-home">
    <DashboardHomeHeader />
    <DashboardMetrics />

    <!-- Orders Grid -->
    <div class="orders-container">
      <div v-if="orders.length === 0" class="no-orders">
        <!-- Intentionally blank for a clean look when no orders -->
      </div>
      <div v-else class="orders-grid">
        <OrderCard 
          v-for="(order, index) in orders" 
          :key="order.id" 
          :order="order" 
          :orderIndex="index"
          @openPrintPreview="openPrintPreview"
          @delete-order="handleDeleteOrder"
        />
      </div>
    </div>

    <!-- Print Modal -->
    <Teleport to="body">
      <div v-if="showPrintModal" class="print-modal-overlay">
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

    <!-- Daily Settlement Modal -->
    <DailySettlementModal 
      :visible="isSettlementModalVisible"
      :settlement="settlementData"
      @close="isSettlementModalVisible = false"
      @download-image="handleDownloadImage"
      @archive-and-clear="handleArchiveAndClear"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue';
import { useOrdersStore, type Order } from '../stores/orders';
import { useRevenueStore } from '../stores/revenue';
import { storeToRefs } from 'pinia';
import html2canvas from 'html2canvas';
import DashboardHomeHeader from './DashboardHomeHeader.vue';
import DashboardMetrics from './DashboardMetrics.vue';
import OrderCard from './OrderCard.vue';
import PrintReceipt from './PrintReceipt.vue';
import DailySettlementModal from './DailySettlementModal.vue';

const emit = defineEmits(['setView']);

// --- Store Setup ---
const ordersStore = useOrdersStore();
const { orders, pendingRevenue } = storeToRefs(ordersStore);
const { clearCompletedOrders, deleteOrder } = ordersStore;

const revenueStore = useRevenueStore();

// --- Delete Order Logic ---
const handleDeleteOrder = (orderId: string) => {
  if (window.confirm('您確定要刪除這筆訂單嗎？此操作無法復原。')) {
    deleteOrder(orderId);
  }
};

// --- Print Modal Logic ---
const showPrintModal = ref(false);
const selectedOrderForPrint = ref<Order | null>(null);

const openPrintPreview = (order: Order) => {
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

// --- Daily Settlement Logic ---
const isSettlementModalVisible = ref(false);
const settlementData = ref({
  date: '',
  totalRevenue: 0,
  totalOrders: 0,
  cashTotal: 0,
  linePayTotal: 0,
  pendingTotal: 0,
});

const openSettlementModal = () => {
  const completedOrders = orders.value.filter(order => order.status === '已完成');
  
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = completedOrders.length;
  
  const cashTotal = completedOrders
    .filter(order => order.paymentMethod === 'cash')
    .reduce((sum, order) => sum + order.total, 0);
  
  const linePayTotal = completedOrders
    .filter(order => order.paymentMethod === 'linepay')
    .reduce((sum, order) => sum + order.total, 0);
    
  settlementData.value = {
    date: new Date().toISOString(),
    totalRevenue,
    totalOrders,
    cashTotal,
    linePayTotal,
    pendingTotal: pendingRevenue.value,
  };
  
  isSettlementModalVisible.value = true;
};

// Expose the function to be called by the parent
defineExpose({
  openSettlementModal,
});

const handleDownloadImage = () => {
  const reportElement = document.getElementById('settlement-report');
  if (reportElement) {
    html2canvas(reportElement, {
      useCORS: true,
      scale: 2, 
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `settlement-report-${new Date().toLocaleDateString('zh-TW')}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    });
  }
};

const handleArchiveAndClear = () => {
  revenueStore.addRevenueRecord(settlementData.value);
  clearCompletedOrders();
  isSettlementModalVisible.value = false;
};

</script>

<style>
/* Global styles for clean printing. Not scoped. */
@media print {
  body > #app {
    display: none;
  }
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
  .print-modal-header,
  .print-modal-footer {
    display: none;
  }
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
/* --- Layout --- */
.orders-container {
  margin-top: 30px;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* --- Buttons --- */
.btn {
  display: flex;
  justify-content: center; /* Center content horizontally */
  align-items: center;
  gap: 8px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  padding: 10px 20px;
}

.btn-primary {
  background-color: #ff6b6b;
  color: white;
}

.btn-grey {
  background-color: #ccc;
  color: #333;
}

/* --- Print Modal --- */
.print-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.print-modal-content {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 440px;
  overflow: hidden;
  animation: fadeIn 0.3s ease-out;
}

.print-modal-header {
  padding: 15px 20px;
  background: #f7f7f7;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.print-modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
}

.print-modal-body {
  padding: 10px;
  max-height: 60vh;
  overflow-y: auto;
  background-color: #f0f2f5;
}

.print-modal-footer {
  padding: 15px 20px;
  background: #f7f7f7;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.print-modal-footer .btn {
    flex: 1; /* <-- 核心改動: 讓按鈕等寬 */
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>