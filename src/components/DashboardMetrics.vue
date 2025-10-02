<template>
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
</template>

<script setup lang="ts">
import { useOrdersStore } from '../stores/orders';
import { storeToRefs } from 'pinia';

const ordersStore = useOrdersStore();
const { totalRevenue, pendingRevenue, totalOrdersCount } = storeToRefs(ordersStore);

</script>

<style scoped>
/* [FIX-7] 縮減底部間距 */
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px; /* 縮減間距 */
}

.metric-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 20px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #777;
  margin-bottom: 10px;
}

.metric-header i {
  font-size: 22px;
  color: #aaa;
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}
</style>
