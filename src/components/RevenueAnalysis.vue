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
      <RevenueChart :chartData="processedRevenueData.chartData" />
      <RevenueStats :totalRevenue="processedRevenueData.totalRevenue" :totalOrders="processedRevenueData.totalOrders" />
    </div>
    <TopItemsList v-if="viewMode === 'topItems'" :topItems="topItems" />
    
    <div v-if="viewMode !== 'topItems' && processedRevenueData.totalOrders === 0" class="no-data-placeholder">
      <p>目前尚無營收紀錄，請先完成每日結算。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRevenueStore } from '../stores/revenue';
import RevenueChart from './RevenueChart.vue';
import RevenueStats from './RevenueStats.vue';
import TopItemsList from './TopItemsList.vue';

const viewMode = ref('7d');

const revenueStore = useRevenueStore();
const { revenueHistory } = storeToRefs(revenueStore);

const processedRevenueData = computed(() => {
  const days = viewMode.value === '7d' ? 7 : 30;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  const filteredRecords = revenueHistory.value.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });

  const chartData = Array(days).fill(0);
  const dateLabels = Array(days).fill(null).map((_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' });
  });
  
  const dateMap = new Map<string, number>();
  filteredRecords.forEach(record => {
    const dateKey = new Date(record.date).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' });
    dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + record.totalRevenue);
  });

  dateLabels.forEach((label, i) => {
      if (dateMap.has(label)) {
          chartData[i] = dateMap.get(label) ?? 0;
      }
  });

  const totalRevenue = filteredRecords.reduce((sum, r) => sum + r.totalRevenue, 0);
  const totalOrders = filteredRecords.reduce((sum, r) => sum + r.totalOrders, 0);

  return {
    chartData,
    totalRevenue,
    totalOrders,
  };
});

const topItems = ref([
  { name: '招牌牛肉麵', quantity: 120 },
  { name: '排骨飯', quantity: 95 },
  { name: '雞腿飯', quantity: 80 },
  { name: '燙青菜', quantity: 75 },
  { name: '珍珠奶茶', quantity: 150 },
]);

</script>

<style scoped>
.revenue-analysis {
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 15px;
  position: relative;
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

.no-data-placeholder {
  text-align: center;
  padding: 50px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px dashed #ddd;
}

.no-data-placeholder p {
  font-size: 18px;
  color: #888;
}
</style>
