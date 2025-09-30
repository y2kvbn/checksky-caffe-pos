<template>
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
</template>

<script setup lang="ts">
defineEmits(['setView']);
</script>

<style scoped>
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

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  padding: 14px 28px;
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

.btn-danger {
  background-color: #555;
  color: white;
}

.btn-danger:hover {
  background-color: #333;
  transform: translateY(-2px);
}
</style>
