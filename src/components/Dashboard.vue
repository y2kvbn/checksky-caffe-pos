<template>
  <div class="dashboard">
    <div class="background-image"></div>
    <header class="header">
      <h1 class="logo">向天泓咖啡廳</h1>
      <button class="btn btn-secondary"><span>&#128197;</span> 訂位總覽</button>
    </header>
    <aside class="sidebar">
      <h2 class="sidebar-title">店家儀表板</h2>
      <nav class="nav">
        <ul>
          <li :class="{ active: activeView === 'DashboardHome' }" @click="activeView = 'DashboardHome'"><a href="#"><span>&#128276;</span> 即時訂單</a></li>
          <li :class="{ active: activeView === 'MenuManagement' }" @click="activeView = 'MenuManagement'"><a href="#"><span>&#127869;</span> 菜單管理</a></li>
          <li :class="{ active: activeView === 'RevenueAnalysis' }" @click="activeView = 'RevenueAnalysis'"><a href="#"><span>&#128202;</span> 營收分析</a></li>
          <li :class="{ active: activeView === 'Promotions' }" @click="activeView = 'Promotions'"><a href="#"><span>&#127991;</span> 優惠活動</a></li>
          <li :class="{ active: activeView === 'SystemSettings' }" @click="activeView = 'SystemSettings'"><a href="#"><span>&#9881;</span> 系統設定</a></li>
        </ul>
      </nav>
      <button class="btn btn-tertiary"><span>&#8962;</span> 回到首頁</button>
    </aside>
    <main class="main-content">
      <Suspense>
        <component :is="views[activeView]" @setView="$emit('setView', $event)" />
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </main>
  </div>
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue';

const emit = defineEmits(['setView']);

const activeView = ref('DashboardHome');

const views = shallowRef({
  DashboardHome: defineAsyncComponent(() => import('./DashboardHome.vue')),
  MenuManagement: defineAsyncComponent(() => import('./MenuManagement.vue')),
  RevenueAnalysis: defineAsyncComponent(() => import('./RevenueAnalysis.vue')),
  Promotions: defineAsyncComponent(() => import('./Promotions.vue')),
  SystemSettings: defineAsyncComponent(() => import('./SystemSettings.vue')),
});
</script>

<style scoped>

.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "header header"
    "sidebar main";
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f8f9fa;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop') no-repeat center center;
  background-size: cover;
  opacity: 0.15;
  z-index: 1;
}

.header, .sidebar, .main-content {
  z-index: 2;
  position: relative;
}

.sidebar {
    z-index: 3;
}

.header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background-color: var(--tertiary-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
}

.logo {
  color: #4eb8d7;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(78, 184, 215, 0.5);
}

.sidebar {
  grid-area: sidebar;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 24px;
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

.sidebar .btn-tertiary {
    margin-top: auto;
}


.main-content {
  grid-area: main;
  padding: 30px;
  overflow-y: auto;
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

.btn-tertiary {
  background-color: var(--tertiary-color);
  color: var(--text-dark);
  width: 100%;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--border-color);
}

.btn-tertiary:hover {
    background-color: #f8f8f8;
}

</style>