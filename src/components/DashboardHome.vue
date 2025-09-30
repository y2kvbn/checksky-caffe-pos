<template>
  <div class="dashboard-home">
    <DashboardHomeHeader @setView="$emit('setView', $event)" />
    <DashboardMetrics />

    <!-- Orders Grid -->
    <div class="orders-container">
      <div v-if="orders.length === 0" class="no-orders">
        <!-- Intentionally blank for a clean look when no orders -->
      </div>
      <div v-else class="orders-grid">
        <OrderCard 
          v-for="order in orders" 
          :key="order.id" 
          :order="order" 
          @openPrintPreview="openPrintPreview"
        />
      </div>
    </div>

    <!-- Print Modal -->
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

<script setup lang="ts">
import { ref } from 'vue';
import { useOrdersStore } from '../stores/orders';
import { storeToRefs } from 'pinia';
import DashboardHomeHeader from './DashboardHomeHeader.vue';
import DashboardMetrics from './DashboardMetrics.vue';
import OrderCard from './OrderCard.vue';
import PrintReceipt from './PrintReceipt.vue';

const emit = defineEmits(['setView']);
const ordersStore = useOrdersStore();
const { orders } = storeToRefs(ordersStore);

const showPrintModal = ref(false);
const selectedOrderForPrint = ref<any>(null);

const openPrintPreview = (order: any) => {
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
  width: 340px;
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
