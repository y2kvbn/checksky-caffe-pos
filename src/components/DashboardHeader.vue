<template>
  <header class="header">
    <h1 class="logo">向天泓咖啡廳</h1>
    <button class="btn btn-secondary" @click="goToReservations"><span>&#128197;</span> 訂位總覽</button>
  </header>
</template>

<script setup lang="ts">
const emit = defineEmits(['goToReservations']);

const goToReservations = () => {
  emit('goToReservations');
};
</script>

<style scoped>
.header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background-color: var(--tertiary-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
  z-index: 2;
  position: relative;
}

.logo {
  color: #4eb8d7;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(78, 184, 215, 0.5);
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--text-dark);
  border: 1px solid var(--secondary-color);
}

.btn-secondary:hover {
    opacity: 0.9;
}
</style>
