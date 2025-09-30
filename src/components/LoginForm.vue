<template>
  <form @submit.prevent="handleLogin">
    <div class="input-group">
      <i class="fas fa-user-alt"></i>
      <input type="text" v-model="username" placeholder="帳號" required>
    </div>
    <div class="input-group">
      <i class="fas fa-lock"></i>
      <input type="password" v-model="password" placeholder="密碼" required>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
    <button type="submit" class="btn-login">登入</button>
    <p class="device-recommendation">建議使用平板設備操作，以享最佳的顯示結果</p>
     <div class="form-footer">
      <a href="#" @click.prevent="$emit('showForgotPassword')" class="forgot-password">忘記密碼?</a>
      <a href="mailto:service@checksky.com.tw" class="contact-support">聯繫客服</a>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const emit = defineEmits(['login-success', 'showForgotPassword']);

const authStore = useAuthStore();

const username = ref('checksky');
const password = ref('');
const error = ref<string | null>(null);

const handleLogin = () => {
  authStore.login({ username: username.value });
  emit('login-success');
};
</script>

<style scoped>
/* Styles from Login.vue */
</style>
