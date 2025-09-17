import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../components/Login.vue';
import NotFound from '../components/NotFound.vue';
import { pinia } from '../main'; // Import pinia from main.ts

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore(pinia);
      if (authStore.isAuthenticated) {
        next('/dashboard/home');
      } else {
        next();
      }
    },
  },
  {
    path: '/dashboard',
    component: () => import('../components/Dashboard.vue'),
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore(pinia);
      if (!authStore.isAuthenticated) {
        next({ name: 'Login' });
      } else if (to.path === '/dashboard' || to.path === '/dashboard/') {
        next('/dashboard/home');
      } else {
        next();
      }
    },
    children: [
      {
        path: 'home',
        name: 'DashboardHome',
        component: () => import('../components/DashboardHome.vue'),
      },
      {
        path: 'pos',
        name: 'PointOfSale',
        component: () => import('../components/PointOfSale.vue'),
      },
      {
        path: 'menu',
        name: 'MenuManagement',
        component: () => import('../components/MenuManagement.vue'),
      },
      {
        path: 'reservations',
        name: 'ReservationManagement',
        component: () => import('../components/ReservationManagement.vue'),
      },
      {
        path: 'revenue',
        name: 'RevenueAnalysis',
        component: () => import('../components/RevenueAnalysis.vue'),
      },
       {
        path: 'promotions',
        name: 'PromotionManagement',
        component: () => import('../components/PromotionManagement.vue'),
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: () => import('../components/SystemSettings.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
