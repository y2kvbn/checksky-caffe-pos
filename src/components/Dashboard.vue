<template>
  <div class="dashboard">
    <div class="background-image"></div>
    <DashboardHeader 
      @goToReservations="goToReservations" 
      @setView="handleSetView" 
      @open-settlement="handleOpenSettlement" 
    />
    <DashboardSidebar :activeView="activeView" @setView="activeView = $event" @logout="handleLogout" />
    <main class="main-content">
      <div v-if="activeView === 'DashboardHome'">
        <DashboardHome ref="dashboardHomeRef" @setView="handleSetView" />
      </div>
      <div v-if="activeView === 'MenuManagement'">
        <MenuManagement />
      </div>
      <div v-if="activeView === 'TableManagement'">
        <TableManagement />
      </div>
      <div v-if="activeView === 'RevenueAnalysis'">
        <RevenueAnalysis />
      </div>
      <div v-if="activeView === 'PromotionManagement'">
        <PromotionManagement />
      </div>
      <div v-if="activeView === 'SystemSettings'">
        <SystemSettings />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import DashboardHeader from './DashboardHeader.vue';
import DashboardSidebar from './DashboardSidebar.vue';
import DashboardHome from './DashboardHome.vue';
import MenuManagement from './MenuManagement.vue';
import TableManagement from './TableManagement.vue';
import RevenueAnalysis from './RevenueAnalysis.vue';
import PromotionManagement from './PromotionManagement.vue';
import SystemSettings from './SystemSettings.vue';

const emit = defineEmits(['setView', 'logout']);

const activeView = ref('DashboardHome');
const dashboardHomeRef = ref<InstanceType<typeof DashboardHome> | null>(null);

const handleLogout = () => {
  emit('logout');
};

const handleSetView = (view: string, options?: any) => {
  emit('setView', view, options);
};

const goToReservations = () => {
  emit('setView', 'pos', { view: 'reservations' });
};

const handleOpenSettlement = async () => {
  if (activeView.value !== 'DashboardHome') {
    activeView.value = 'DashboardHome';
    await nextTick();
  }
  dashboardHomeRef.value?.openSettlementModal();
};

</script>

<style scoped>
/* [FIX-6] 重構 Grid 結構以匹配設計圖 */
.dashboard {
  display: grid;
  /* 左側邊欄寬度固定，右側內容佔滿剩餘空間 */
  grid-template-columns: 260px 1fr; 
  /* 頂部 Header 高度自適應，主內容區域佔滿剩餘高度 */
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f8f9fa;
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

.main-content {
  grid-area: main;
  padding: 30px;
  overflow-y: auto;
  z-index: 2;
  position: relative;
}
</style>