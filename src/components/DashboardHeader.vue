<template>
  <header class="header">
    <div class="header-placeholder"></div>
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
.header {
  grid-area: header;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 10px 30px;
  background-color: var(--tertiary-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
  z-index: 2;
  position: relative;
}

.header-placeholder {
  grid-column: 1;
}

.logo {
  grid-column: 2;
  justify-self: center;
  color: #4eb8d7;
  font-size: 31px; /* Increased by ~10% from 28px */
  font-weight: bold;
  text-shadow: 0 0 5px rgba(78, 184, 215, 0.5);
}

.header-actions {
  grid-column: 3;
  justify-self: end;
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
