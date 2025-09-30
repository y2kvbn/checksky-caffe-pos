<template>
  <div class="top-items-container">
    <h3>熱賣品項 Top 5</h3>
    <ul>
      <li v-for="(item, index) in topItems" :key="index">
        <span class="item-rank">{{ index + 1 }}.</span>
        <span class="item-name">{{ item.name }}</span>
        <span class="item-quantity">售出：{{ item.quantity }} 份</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ topItems: any[] }>();
</script>

<style scoped>
.top-items-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.top-items-container h3 {
  font-size: 22px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.top-items-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.top-items-container li {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.top-items-container li:last-child {
  border-bottom: none;
}

.top-items-container li:hover {
  background-color: #f5f5f5;
}

.item-rank {
  font-size: 18px;
  font-weight: 600;
  color: #4eb8d7;
  margin-right: 15px;
  width: 30px;
}

.item-name {
  font-size: 18px;
  color: #333;
  flex-grow: 1;
}

.item-quantity {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}
</style>
