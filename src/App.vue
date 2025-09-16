<template>
  <component :is="activeComponent" @setView="setView" @login-success="onLoginSuccess" />
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue';

// Lazy load components
const Login = defineAsyncComponent(() => import('./components/Login.vue'));
const Dashboard = defineAsyncComponent(() => import('./components/Dashboard.vue'));
const PointOfSale = defineAsyncComponent(() => import('./components/PointOfSale.vue'));

const isLoggedIn = ref(false);
const activeComponent = shallowRef(Login);

const views = {
  dashboard: Dashboard,
  pos: PointOfSale,
};

const setView = (view) => {
  if (isLoggedIn.value && views[view]) {
    activeComponent.value = views[view];
  } else if (!isLoggedIn.value) {
    activeComponent.value = Login;
  }
};

const onLoginSuccess = () => {
  isLoggedIn.value = true;
  activeComponent.value = Dashboard;
};

// Initially, if not logged in, show the Login component
if (!isLoggedIn.value) {
  activeComponent.value = Login;
}

</script>

<style>
/* Global styles remain the same */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* Ensure app takes full viewport height for login centering */
  height: 100vh;
  background-color: #f0f2f5; /* Match login background */
}

body {
  margin: 0;
}
</style>
