
<template>
  <form @submit.prevent="handleLogin" class="login-form-content">
    
    <div class="input-wrapper">
      <i class="fas fa-user-alt input-icon"></i>
      <input 
        type="text" 
        v-model="username" 
        placeholder="帳號 (預設: checksky)" 
        required
        class="input-field"
      >
    </div>

    <div class="input-wrapper">
      <i class="fas fa-lock input-icon"></i>
      <input 
        type="password" 
        v-model="password" 
        placeholder="密碼 (預設: 1234)" 
        required
        class="input-field"
      >
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <button type="submit" class="login-button">
      <span class="button-text">安全登入</span>
      <i class="fas fa-arrow-right button-icon"></i>
    </button>

    <div class="form-footer">
      <a href="#" @click.prevent="$emit('showForgotPassword')" class="footer-link">忘記密碼?</a>
      <a href="mailto:service@checksky.com.tw" class="footer-link">聯繫客服</a>
    </div>

    <p class="device-recommendation">為達最佳體驗，建議使用平板設備操作</p>

  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const emit = defineEmits(['login-success', 'showForgotPassword']);

const authStore = useAuthStore();

const username = ref('checksky');
const password = ref('1234');
const error = ref<string | null>(null);

const handleLogin = () => {
  if (username.value === 'checksky' && password.value === '1234') {
    authStore.login({ username: username.value });
    emit('login-success');
    error.value = null; // Clear error on successful login
  } else {
    error.value = '帳號或密碼錯誤，請重新輸入。';
  }
};
</script>

<style scoped>
/* --- Form Content --- */
.login-form-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px; /* Increased gap between elements */
}

/* --- Input Fields --- */
.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  color: #9a9a9a;
  font-size: 18px; /* Slightly larger icon */
}

.input-field {
  width: 100%;
  padding: 18px 20px 18px 60px; /* Increased padding */
  border: 1px solid #e0e0e0;
  border-radius: 12px; /* Softer corners */
  font-size: 17px; /* Larger font size */
  background-color: #f7f7f7;
  color: #333;
  transition: all 0.3s ease;
  box-sizing: border-box; 
}

.input-field::placeholder {
  color: #aaa;
}

.input-field:focus {
  outline: none;
  border-color: #4A90E2; /* Highlight color on focus */
  background-color: #fff;
  box-shadow: 0 0 15px rgba(74, 144, 226, 0.2); /* Soft glow effect */
}

/* --- Login Button --- */
.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 18px 25px; /* Increased padding */
  margin-top: 15px; /* Margin from top */
  background: linear-gradient(45deg, #4A90E2, #50E3C2);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 19px; /* Larger font size */
  font-weight: bold;
  cursor: pointer;
  transition: all 0.35s ease;
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.3);
  overflow: hidden;
  position: relative;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(80, 227, 194, 0.4);
}

.button-text {
  margin-right: 15px;
}

.button-icon {
  transition: transform 0.3s ease;
}

.login-button:hover .button-icon {
  transform: translateX(5px);
}


/* --- Error Message --- */
.error-message {
  color: #e74c3c;
  background-color: #fdd;
  border: 1px solid #e74c3c;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  font-weight: 500;
  margin-top: -10px;
  margin-bottom: 5px;
}

/* --- Footer Links & Text --- */
.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.footer-link {
  font-size: 14px;
  color: #777;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #4A90E2;
}

.device-recommendation {
  font-size: 13px;
  color: #888;
  text-align: center;
  margin-top: 10px;
}
</style>
