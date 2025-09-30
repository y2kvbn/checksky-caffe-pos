<template>
  <div class="dashboard">
    <div class="background-image"></div>
    <DashboardHeader @goToReservations="goToReservations" />
    <DashboardSidebar :activeView="activeView" @setView="activeView = $event" @logout="handleLogout" />
    <main class="main-content">
      <!-- 
        The setView event from DashboardHome is for navigating *outside* the dashboard (e.g., to the POS).
        It needs to be emitted upwards to the parent component (App.vue), not handled here.
        The sidebar handles internal view switching by setting activeView directly.
      -->
      <div v-if="activeView === 'DashboardHome'">
        <DashboardHome @setView="$emit('setView', $event)" />
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
import { ref } from 'vue';
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

const handleLogout = () => {
  emit('logout');
};

const goToReservations = () => {
  // This emits to App.vue to switch to the POS view, with a specific sub-view
  emit('setView', 'pos', { view: 'reservations' });
};
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

.main-content {
  grid-area: main;
  padding: 30px;
  overflow-y: auto;
  z-index: 2;
  position: relative;
}
</style>
