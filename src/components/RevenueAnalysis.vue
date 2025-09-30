<template>
  <div class="revenue-analysis">
    <h2>營收分析</h2>
    <div class="controls">
      <div class="time-range-selector">
        <button :class="{ active: viewMode === '7d' }" @click="viewMode = '7d'">7日</button>
        <button :class="{ active: viewMode === '30d' }" @click="viewMode = '30d'">30日</button>
        <button :class="{ active: viewMode === 'topItems' }" @click="viewMode = 'topItems'">熱賣品項</button>
      </div>
    </div>
    <div v-if="viewMode !== 'topItems'">
      <RevenueChart :chartData="revenueData[viewMode].chartData" />
      <RevenueStats :totalRevenue="totalRevenue" :totalOrders="totalOrders" />
    </div>
    <TopItemsList v-if="viewMode === 'topItems'" :topItems="topItems" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import RevenueChart from './RevenueChart.vue';
import RevenueStats from './RevenueStats.vue';
import TopItemsList from './TopItemsList.vue';

const viewMode = ref('7d');

const revenueData = {
  '7d': {
    revenue: 46246,
    orders: 150,
    chartData: [6423, 7891, 4231, 8888, 9123, 4567, 5123],
  },
  '30d': {
    revenue: 210992,
    orders: 750,
    chartData: [6423, 7891, 4231, 8888, 9123, 4567, 5123, 6789, 7123, 8999, 9876, 5432, 5890, 6321, 7890, 5123, 8345, 9456, 4789, 5321, 6890, 7321, 8765, 9876, 5234, 5789, 6123, 7654, 5012, 8123],
  },
};

const topItems = ref([
  { name: '招牌牛肉麵', quantity: 120 },
  { name: '排骨飯', quantity: 95 },
  { name: '雞腿飯', quantity: 80 },
  { name: '燙青菜', quantity: 75 },
  { name: '珍珠奶茶', quantity: 150 },
]);

const totalRevenue = computed(() => revenueData[viewMode.value]?.revenue);
const totalOrders = computed(() => revenueData[viewMode.value]?.orders);
</script>

<style scoped>
.revenue-analysis {
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 15px;
}

.revenue-analysis h2 {
  font-size: 28px;
  margin-bottom: 25px;
  color: #333;
  font-weight: 600;
}

.controls {
  margin-bottom: 25px;
}

.time-range-selector {
  display: inline-flex;
  border: 1px solid #ddd;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.time-range-selector button {
  padding: 10px 25px;
  border: none;
  background-color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.time-range-selector button:not(:last-child) {
  border-right: 1px solid #ddd;
}

.time-range-selector button.active {
  background-color: #4eb8d7;
  color: white;
  font-weight: 600;
}
</style>
