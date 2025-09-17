import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const AUTH_KEY = 'caffe_pos_auth';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const state = ref<AuthState>({
    isAuthenticated: false,
    username: null,
  });

  // 從 sessionStorage 初始化狀態
  const savedAuth = sessionStorage.getItem(AUTH_KEY);
  if (savedAuth) {
    try {
      const parsed = JSON.parse(savedAuth);
      state.value.isAuthenticated = parsed.isAuthenticated;
      state.value.username = parsed.username;
    } catch (e) {
      console.error("無法從 sessionStorage 解析認證狀態:", e);
    }
  }

  const isAuthenticated = computed(() => state.value.isAuthenticated);
  const username = computed(() => state.value.username);

  function login(user: string) {
    state.value.isAuthenticated = true;
    state.value.username = user;
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(state.value));
    router.push('/dashboard/home');
  }

  function logout() {
    state.value.isAuthenticated = false;
    state.value.username = null;
    sessionStorage.removeItem(AUTH_KEY);
    router.push('/');
  }

  return { isAuthenticated, username, login, logout };
});
