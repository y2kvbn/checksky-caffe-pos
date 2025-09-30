<template>
  <div class="login-container">
    <div class="login-page">
      <!-- Left Side: Single Vertical Image -->
      <div class="login-gallery">
        <img src="https://i.ibb.co/Ps6cZqdL/2025-09-17-091832-processed-lightpdf-com.jpg" alt="Cafe Staff" class="gallery-image"/>
      </div>

      <!-- Right Side: Form Container -->
      <div class="login-form-container">
        <div class="login-form">
          <!-- Logo and Title -->
          <div class="logo">
            <span class="logo-icon"><i class="fas fa-utensils"></i></span>
            <span class="logo-text">iCheck</span>
          </div>
          <h2 class="form-title">{{ formTitle }}</h2>

          <!-- Dynamic Form Component -->
          <component 
            :is="currentView.component"
            @login-success="handleLoginSuccess"
            @showForgotPassword="viewState = 'forgotPassword'"
            @showEnterCode="viewState = 'enterCode'"
            @showResetPassword="viewState = 'resetPassword'"
            @showSuccess="viewState = 'success'"
            @backToLogin="viewState = 'login'"
          />

           <!-- Success Message -->
          <div v-if="viewState === 'success'">
            <p class="success-message"><i class="fas fa-check-circle"></i> 密碼已成功更新！</p>
            <button @click="viewState = 'login'" class="btn-login">返回登入</button>
          </div>

          <!-- Copyright -->
          <div class="system-info">
            <p>Copyright &copy; 2024 CheckSky Co., Ltd.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LoginForm from './LoginForm.vue';
import ForgotPasswordForm from './ForgotPasswordForm.vue';
import VerifyCodeForm from './VerifyCodeForm.vue';
import ResetPasswordForm from './ResetPasswordForm.vue';

// Emits
const emit = defineEmits(['login-success']);

type ViewState = 'login' | 'forgotPassword' | 'enterCode' | 'resetPassword' | 'success';

const viewState = ref<ViewState>('login');

const viewComponents = {
  login: { component: LoginForm, title: '點餐系統登入' },
  forgotPassword: { component: ForgotPasswordForm, title: '忘記密碼' },
  enterCode: { component: VerifyCodeForm, title: '輸入驗證碼' },
  resetPassword: { component: ResetPasswordForm, title: '設定新密碼' },
  success: { component: null, title: '重設成功' }
};

const currentView = computed(() => viewComponents[viewState.value]);
const formTitle = computed(() => currentView.value.title);

const handleLoginSuccess = () => {
  emit('login-success');
};
</script>

<style scoped>
/* --- Base & Layout -- */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '\\5FAE軟正黑體', Arial, sans-serif;
}

.login-page {
  display: flex;
  width: 960px;
  height: 600px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* --- Gallery (Left side) --- */
.login-gallery {
  flex: 0 0 45%;
  background-color: #333;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right; /* Focuses on the right part of the image */
}

/* --- Form (Right side) --- */
.login-form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
}

.login-form {
  width: 100%;
  max-width: 350px;
  text-align: center;
}

/* Logo and Titles */
.logo {
  display: flex; justify-content: center; align-items: center;
  margin-bottom: 10px; font-size: 42px; font-weight: bold; color: #333;
}
.logo-icon { color: #ff6b6b; margin-right: 12px; }
.form-title { font-size: 22px; color: #555; margin-bottom: 25px; font-weight: 500; }
.form-instruction { color: #666; margin-bottom: 20px; font-size: 14px; line-height: 1.5; }

/* Input Groups */
.input-group {
  position: relative;
  margin-bottom: 18px;
}
.input-group i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa; }
.input-group input {
  width: 100%; padding: 12px 15px 12px 45px;
  border: 1px solid #ddd; border-radius: 8px; font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.input-group input:focus { outline: none; border-color: #ff6b6b; box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2); }

/* Buttons */
.btn-login {
  width: 100%; padding: 12px; margin-top: 10px;
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  border: none; border-radius: 8px; color: white;
  font-size: 18px; font-weight: bold; cursor: pointer;
  transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}
.btn-login:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5); }

/* Text & Links */
.device-recommendation { font-size: 12px; color: #888; margin-top: 15px; text-align: center; }
.error-message { color: #e74c3c; margin-bottom: 15px; font-weight: 500; font-size: 14px; }
.success-message { color: #28a745; font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 20px;}
.success-message i { margin-right: 8px; }

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 14px;
}

.form-footer a, .back-link {
  text-decoration: none;
  transition: opacity 0.2s;
}
.form-footer a:hover, .back-link:hover { opacity: 0.7; }

.forgot-password { color: #777; }
.contact-support { color: #007bff; font-weight: 500; }
.back-link { color: #007bff; font-weight: 500; text-align: center; display: block; margin-top: 15px; }

/* Footer Copyright */
.system-info { position: absolute; bottom: 20px; width: 100%; text-align: center; font-size: 12px; color: #aaa; }
</style>