<template>
  <header class="pos-header">
    <button class="btn btn-outline" @click="$emit('setView', 'dashboard')"><span>&#128187;</span> 返回儀表板</button>
    <h1 class="logo">向天泓咖啡廳</h1>
    <div>
      <button class="btn btn-outline" @click="$emit('setPosView', 'reservations')" :class="{ active: posView === 'reservations' }"><span>&#128197;</span> 訂位總覽</button>
      <button v-if="posView === 'reservations'" class="btn btn-outline" @click="$emit('setPosView', 'menu')"><span>&#127869;</span> 返回點餐</button>
      <button v-else class="btn btn-outline" @click="$emit('setPosView', 'menu')" :class="{ active: posView === 'menu' }"><span>&#127869;</span> 點餐</button>
    </div>
  </header>
</template>

<script setup lang="ts">

defineProps<{ posView: string }>();

defineEmits<{
  (e: 'setView', view: string): void;
  (e: 'setPosView', view: string): void;
}>();

</script>

<style scoped>
.pos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background-color: var(--tertiary-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
  z-index: 10;
  flex-shrink: 0;
}

.pos-header .logo {
  color: #4eb8d7;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(78, 184, 215, 0.5);
}

.pos-header div {
  display: flex;
  gap: 15px;
}

.btn-outline {
  background-color: transparent;
  color: #ff6b6b;
  border: 1px solid #ffb997;
}

.btn-outline:hover,
.btn-outline.active {
  background-color: #ffb997;
  color: var(--text-dark);
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
