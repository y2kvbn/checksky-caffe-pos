<template>
  <header class="header">
    <h1 class="logo">向天泓咖啡廳</h1>
    <div class="header-actions">
      <button class="btn btn-primary" @click="$emit('setView', 'pos')">
        <i class="fas fa-utensils"></i> 前往點餐
      </button>
      <button class="btn btn-secondary" @click="$emit('goToReservations')"><span>&#128197;</span> 訂位總覽</button>
      <button class="btn btn-danger" @click="$emit('open-settlement')">
        <i class="fas fa-chart-line"></i> 每日結算
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits(['setView', 'goToReservations', 'open-settlement']);
</script>

<style scoped>
/* [FIX-6] 調整 Header 樣式以適應新佈局 */
.header {
  grid-area: header;
  display: flex; /* 改用 Flexbox 佈局 */
  justify-content: space-between; /* 兩端對齊 */
  align-items: center;
  padding: 10px 30px 10px 0; /* 移除左邊 padding，因為 main-content 會提供 */
  background-color: transparent; /* 移除背景色 */
  z-index: 2;
  position: relative;
}

.logo {
  color: #4eb8d7;
  font-size: 31px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(78, 184, 215, 0.5);
}

.header-actions {
  display: flex;
  gap: 20px;
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
  padding: 12px 24px;
  font-size: 16px;
}

.btn-primary {
  background-color: #ff6b6b;
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--text-dark);
  border: 1px solid var(--secondary-color);
}

.btn-secondary:hover {
    opacity: 0.9;
}

.btn-danger {
  background-color: #555;
  color: white;
}

.btn-danger:hover {
  background-color: #333;
  transform: translateY(-2px);
}
</style>
