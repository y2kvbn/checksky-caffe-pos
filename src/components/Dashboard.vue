<template>
  <div class="dashboard">
    <div class="background-image"></div>
    <DashboardHeader @goToReservations="goToReservations" />
    <DashboardSidebar :activeView="activeView" @setView="activeView = $event" @logout="handleLogout" />
    <main class="main-content">
      <Suspense>
        <component :is="views[activeView]" @setView="handleSetView" />
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, defineAsyncComponent } from 'vue';
import DashboardHeader from './DashboardHeader.vue';
import DashboardSidebar from './DashboardSidebar.vue';

const emit = defineEmits(['setView', 'logout']);

const activeView = ref('DashboardHome');

const views = shallowRef({
  DashboardHome: defineAsyncComponent(() => import('./DashboardHome.vue')),
  MenuManagement: defineAsyncComponent(() => import('./MenuManagement.vue')),
  TableManagement: defineAsyncComponent(() => import('./TableManagement.vue')),
  RevenueAnalysis: defineAsyncComponent(() => import('./RevenueAnalysis.vue')),
  PromotionManagement: defineAsyncComponent(() => import('./PromotionManagement.vue')),
  SystemSettings: defineAsyncComponent(() => import('./SystemSettings.vue')),
});

const handleLogout = () => {
  emit('logout');
};

const handleSetView = (view) => {
    emit('setView', view);
};

const goToReservations = () => {
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
