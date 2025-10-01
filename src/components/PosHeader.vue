<template>
  <header class="pos-header">
    <!-- 左側按鈕 -->
    <button class="btn btn-outline" @click="$emit('setView', 'dashboard')"><span>&#128187;</span> 返回儀表板</button>
    
    <!-- 中間 Logo -->
    <h1 class="logo">向天泓咖啡廳</h1>
    
    <!-- 
      核心改動 1: 
      - 移除原本包住右側按鈕的多餘 <div>
      - 讓所有按鈕直接成為 .pos-header (flex container) 的子元素
      - 這樣它們就能共享 align-items: center 屬性，實現垂直對齊
    -->
    <div class="header-actions">
      <div class="table-selection-wrapper">
        <div v-if="selectedTable" class="table-display">
          <span>桌號: <strong>{{ selectedTable.name }}</strong></span>
          <button @click="$emit('openTableModal')">更換</button>
        </div>
        <button v-else class="btn btn-secondary" @click="$emit('openTableModal')">&#128442; 選擇桌號</button>
      </div>
      
      <button class="btn btn-outline" @click="$emit('setPosView', 'reservations')" :class="{ active: posView === 'reservations' }"><span>&#128197;</span> 訂位總覽</button>
      
      <button v-if="posView === 'reservations'" class="btn btn-outline" @click="$emit('setPosView', 'menu')"><span>&#127869;</span> 返回點餐</button>
      <button v-else class="btn btn-outline active" @click="$emit('setPosView', 'menu')"><span>&#127869;</span> 點餐</button>
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
  align-items: center; /* 這是讓所有子元素垂直置中的關鍵 */
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
  margin: 0; /* 確保 logo 本身沒有多餘的 margin */
}

/* 
  核心改動 2: 
  - 新增 .header-actions 容器
  - 它也使用 flex 和 align-items: center 來確保內部元素對齊
*/
.header-actions {
  display: flex;
  align-items: center; /* 確保容器內的按鈕和桌號選擇器對齊 */
  gap: 15px;
}

.btn {
  padding: 12px 20px; /* 統一內邊距 */
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
  height: 48px; /* 核心改動 3: 強制設定一個統一的高度 */
  line-height: 1; /* 確保文字在按鈕內垂直居中 */
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

/* 
  核心改動 4: 
  - 移除 table-selection-wrapper 的邊框和多餘邊距
  - 讓它看起來更像一個按鈕組
*/
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
  height: 48px; /* 與其他按鈕高度一致 */
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
