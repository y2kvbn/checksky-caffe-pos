import { createApp } from 'vue';
import { pinia } from './stores'; // Corrected import path
import App from './App.vue';
import router from './router';
import './style.css';
import './firebaseConfig'; // Import and initialize Firebase

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount('#app');
