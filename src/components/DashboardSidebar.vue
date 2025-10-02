<template>
  <aside class="sidebar">
    <h2 class="sidebar-title">店家儀表板</h2>
    <nav class="nav">
      <ul>
        <li :class="{ active: activeView === 'DashboardHome' }" @click="$emit('setView', 'DashboardHome')"><a href="#"><span>&#128276;</span> 即時訂單</a></li>
        <li :class="{ active: activeView === 'MenuManagement' }" @click="$emit('setView', 'MenuManagement')"><a href="#"><span>&#127869;</span> 菜單管理</a></li>
        <li :class="{ active: activeView === 'TableManagement' }" @click="$emit('setView', 'TableManagement')"><a href="#"><span>&#129681;</span> 桌號管理</a></li>
        <li :class="{ active: activeView === 'RevenueAnalysis' }" @click="$emit('setView', 'RevenueAnalysis')"><a href="#"><span>&#128202;</span> 營收分析</a></li>
        <li :class="{ active: activeView === 'PromotionManagement' }" @click="$emit('setView', 'PromotionManagement')"><a href="#"><span>&#127991;</span> 優惠活動</a></li>
        <li :class="{ active: activeView === 'SystemSettings' }" @click="$emit('setView', 'SystemSettings')"><a href="#"><span>&#9881;</span> 系統設定</a></li>
      </ul>
    </nav>
    <button class="btn btn-tertiary btn-logout" @click="$emit('logout')"><span>&#128682;</span> 登出</button>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  activeView: String,
});

defineEmits(['setView', 'logout']);

</script>

<style scoped>
/* [FIX-6] 微調 padding 和標題樣式以達成最終對齊 */
.sidebar {
  grid-area: sidebar;
  padding: 22px 30px 30px 30px; /* 微調頂部 padding */
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  z-index: 3;
  position: relative;
  border-right: 1px solid #e0e0e0; /* 新增右邊框以區分區域 */
}

.sidebar-title {
  font-size: 31px; /* 與 Header Logo 字體大小一致 */
  font-weight: bold;
  color: var(--text-dark);
  margin-bottom: 30px;
}

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.nav li {
  margin-bottom: 15px;
  cursor: pointer;
}

.nav a {
  text-decoration: none;
  color: var(--text-light);
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.nav a span {
    margin-right: 15px;
    font-size: 20px;
}

.nav li.active a {
  background-color: var(--secondary-color);
  color: var(--text-dark);
  font-weight: bold;
}

.nav li:not(.active) a:hover {
    background-color: #f0f0f0;
}

.sidebar .btn-logout {
    margin-top: auto;
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

.btn-tertiary {
  background-color: var(--tertiary-color);
  color: var(--text-dark);
  width: 100%;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--border-color);
}

.btn-tertiary:hover {
    background-color: #e2e6ea;
}

.btn-logout {
  background-color: #f8d7da; 
  color: #721c24; 
  border: 1px solid #f5c6cb;
}

.btn-logout:hover {
    background-color: #f5c6cb;
    border-color: #f1b0b7;
}
</style>
