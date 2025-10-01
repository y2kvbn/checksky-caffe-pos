<template>
  <header class="pos-header">
    <!-- 左側按鈕 -->
    <button class="btn btn-outline" @click="$emit('setView', 'dashboard')"><span>&#128187;</span> 返回儀表板</button>
    
    <!-- 中間 Logo -->
    <h1 class="logo">向天泓咖啡廳</h1>
    
    <div class="header-actions">
      <div class="table-selection-wrapper">
        <div v-if="selectedTable" class="table-display">
          <span>桌號: <strong>{{ selectedTable.name }}</strong></span>
          <button @click="$emit('openTableModal')">更換</button>
        </div>
        <button v-else class="btn btn-secondary" @click="$emit('openTableModal')">&#128442; 選擇桌號</button>
      </div>
      
      <button class="btn btn-outline" @click="$emit('setPosView', 'reservations')" :class="{ active: posView === 'reservations' }"><span>&#128197;</span> 訂位總覽</button>
      
      <!-- 核心改動: 移除冗餘的「點餐」按鈕。當處於訂位總覽視圖時，顯示「返回點餐」按鈕 -->
      <button v-if="posView === 'reservations'" class="btn btn-outline" @click="$emit('setPosView', 'menu')"><span>&#127869;</span> 返回點餐</button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ 
  posView: string,
  selectedTable: any
}>();

defineEmits<{
  (e: 'setView', view: string): void;
  (e: 'setPosView', view: string): void;
  (e: 'openTableModal'): void;
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

.logo {
  color: #4eb8d7;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(78, 184, 215, 0.5);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn {
  /* 核心改動: 將左右 padding 從 20px 增加到 22px，以加寬按鈕 */
  padding: 12px 22px;
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
  height: 48px;
  line-height: 1;
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

.btn-secondary {
    background-color: #a0aec0;
    color: white;
}

.table-selection-wrapper {
  padding: 0;
  margin: 0;
  border: none;
}

.table-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  padding: 0 15px;
  border-radius: 8px;
  height: 48px;
}

.table-display span {
  font-size: 1rem;
  color: #333;
  font-weight: bold;
}

.table-display button {
  font-size: 0.9rem;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: #d1d5db;
  cursor: pointer;
  border: none;
  margin-left: 10px;
}
</style>
