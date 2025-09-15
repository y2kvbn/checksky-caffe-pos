<template>
  <component :is="activeComponent" @setView="setView" />
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue';

// Lazy load the main components
const Dashboard = defineAsyncComponent(() => import('./components/Dashboard.vue'));
const PointOfSale = defineAsyncComponent(() => import('./components/PointOfSale.vue'));

const activeComponent = shallowRef(Dashboard);
const views = {
  dashboard: Dashboard,
  pos: PointOfSale,
};

const setView = (view) => {
  if (views[view]) {
    activeComponent.value = views[view];
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
