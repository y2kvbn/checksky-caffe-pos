<template>
  <component 
    :is="activeComponent" 
    v-bind="viewProps"
    @setView="setView" 
    @login-success="onLoginSuccess" 
    @logout="onLogout"
  />
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent, onMounted } from 'vue';

// Lazy load components for better initial load performance
const Login = defineAsyncComponent(() => import('./components/Login.vue'));
const Dashboard = defineAsyncComponent(() => import('./components/Dashboard.vue'));
const PointOfSale = defineAsyncComponent(() => import('./components/PointOfSale.vue'));

// State to track authentication status and view properties
const isLoggedIn = ref(false);
const activeComponent = shallowRef(null);
const viewProps = ref({}); // Holds props for the currently active component

// Mapping of view names to component definitions
const views = {
  dashboard: Dashboard,
  pos: PointOfSale,
};

/**
 * Handles view switching from within components. It can also pass props (parameters)
 * to the component being switched to.
 */
const setView = (view, params = {}) => {
  if (isLoggedIn.value && views[view]) {
    activeComponent.value = views[view];
    viewProps.value = params; // Pass params as props to the component
  } else if (!isLoggedIn.value) {
    activeComponent.value = Login;
    viewProps.value = {};
  }
};

/**
 * Called upon successful user authentication. Switches to the main Dashboard.
 */
const onLoginSuccess = () => {
  isLoggedIn.value = true;
  activeComponent.value = Dashboard;
  viewProps.value = {}; // Reset props
};

/**
 * Handles the logout process. Returns to the Login screen.
 */
const onLogout = () => {
  isLoggedIn.value = false;
  activeComponent.value = Login;
  viewProps.value = {}; // Reset props
};

// onMounted lifecycle hook to set the initial component.
onMounted(() => {
  if (!isLoggedIn.value) {
    activeComponent.value = Login;
  }
});

</script>

<style>
/* Global styles for the entire application */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  background-color: #f0f2f5;
}

body {
  margin: 0;
}
</style>
