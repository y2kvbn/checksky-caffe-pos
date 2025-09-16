<template>
  <component 
    :is="activeComponent" 
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

// State to track authentication status
const isLoggedIn = ref(false);

// Holds the currently active component (Login, Dashboard, or POS)
const activeComponent = shallowRef(null);

// Mapping of view names to component definitions
const views = {
  dashboard: Dashboard,
  pos: PointOfSale,
};

/**
 * Handles view switching from within the Dashboard or other main components.
 * Ensures that only authenticated users can access protected views.
 */
const setView = (view) => {
  if (isLoggedIn.value && views[view]) {
    activeComponent.value = views[view];
  } else if (!isLoggedIn.value) {
    activeComponent.value = Login;
  }
};

/**
 * Called upon successful user authentication.
 * Updates the application state to reflect that the user is logged in
 * and switches the view to the main Dashboard.
 */
const onLoginSuccess = () => {
  isLoggedIn.value = true;
  activeComponent.value = Dashboard;
};

/**
 * Handles the logout process.
 * Resets the authentication state and returns the user to the Login screen.
 */
const onLogout = () => {
  isLoggedIn.value = false;
  activeComponent.value = Login;
};

// onMounted lifecycle hook to set the initial component.
// This ensures that on page load, we show the Login screen.
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
  /* Ensure the app container takes full viewport height, crucial for components like the login screen */
  height: 100vh;
  background-color: #f0f2f5; /* A neutral background color that matches the login page */
}

body {
  margin: 0;
}
</style>
