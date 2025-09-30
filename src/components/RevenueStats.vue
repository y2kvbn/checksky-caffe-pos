<template>
  <div class="stats-container">
    <div class="stat-item">
      <h4>總營收</h4>
      <p>{{ totalRevenue }}</p>
    </div>
    <div class="stat-item">
      <h4>總訂單數</h4>
      <p>{{ totalOrders }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ 
  totalRevenue: number, 
  totalOrders: number 
}>();

const formattedTotalRevenue = computed(() => `NT$ ${props.totalRevenue.toLocaleString()}`);
</script>

<style scoped>
.stats-container {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item h4 {
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
}

.stat-item p {
  font-size: 24px;
  color: #333;
  font-weight: 600;
}
</style>
