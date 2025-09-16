<template>
  <div class="login-container">
    <div class="login-page">
      <!-- Left Side: Single Vertical Image -->
      <div class="login-gallery">
        <img src="https://i.ibb.co/ZzPs8vXt/Artguru-text2image-20250916102830.png" alt="Cafe Staff" class="gallery-image"/>
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

          <!-- Login Form -->
          <form v-if="viewState === 'login'" @submit.prevent="handleLogin">
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
              <a href="#" @click.prevent="showForgotPassword" class="forgot-password">忘記密碼?</a>
              <a href="mailto:service@checksky.com.tw" class="contact-support">聯繫客服</a>
            </div>
          </form>

          <!-- Forgot Password Form -->
          <form v-if="viewState === 'forgotPassword'" @submit.prevent="handleSendCode">
             <p class="form-instruction">請輸入您的手機號碼以接收驗證碼。</p>
            <div class="input-group">
              <i class="fas fa-mobile-alt"></i>
              <input type="tel" v-model="phoneNumber" placeholder="手機號碼" required>
            </div>
            <button type="submit" class="btn-login">發送驗證碼</button>
             <div class="form-footer">
                <a href="#" @click.prevent="backToLogin" class="back-link">返回登入</a>
            </div>
          </form>

          <!-- Verify Code Form -->
          <form v-if="viewState === 'enterCode'" @submit.prevent="handleVerifyCode">
            <p class="form-instruction">我們已發送一組 4 位數驗證碼到您的手機。<br>(模擬驗證碼: 1234)</p>
            <div class="input-group">
              <i class="fas fa-key"></i>
              <input type="text" v-model="verificationCode" placeholder="4位數驗證碼" required maxlength="4">
            </div>
            <div v-if="error" class="error-message">{{ error }}</div>
            <button type="submit" class="btn-login">驗證</button>
             <div class="form-footer">
                <a href="#" @click.prevent="backToLogin" class="back-link">返回登入</a>
            </div>
          </form>

          <!-- Reset Password Form -->
          <form v-if="viewState === 'resetPassword'" @submit.prevent="handleResetPassword">
            <p class="form-instruction">驗證成功！請設定您的新密碼。</p>
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input type="password" v-model="newPassword" placeholder="新密碼" required>
            </div>
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input type="password" v-model="confirmPassword" placeholder="確認新密碼" required>
            </div>
            <div v-if="error" class="error-message">{{ error }}</div>
            <button type="submit" class="btn-login">重設密碼</button>
             <div class="form-footer">
                <a href="#" @click.prevent="backToLogin" class="back-link">返回登入</a>
            </div>
          </form>

           <!-- Success Message -->
          <div v-if="viewState === 'success'">
            <p class="success-message"><i class="fas fa-check-circle"></i> 密碼已成功更新！</p>
            <button @click="backToLogin" class="btn-login">返回登入</button>
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

<script setup>
import { ref, computed } from 'vue';

// Emits
const emit = defineEmits(['login-success']);

// State management
const viewState = ref('login'); // login, forgotPassword, enterCode, resetPassword, success
const error = ref(null);

// Login credentials
const username = ref('checksky');
const password = ref('');
const userDatabase = ref({ // Simulated user database
  checksky: '1234'
});

// Forgot password fields
const phoneNumber = ref('');
const verificationCode = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// Computed property for form title
const formTitle = computed(() => {
  switch (viewState.value) {
    case 'login': return '總部系統登入';
    case 'forgotPassword': return '忘記密碼';
    case 'enterCode': return '輸入驗證碼';
    case 'resetPassword': return '設定新密碼';
    case 'success': return '重設成功';
    default: return '總部系統';
  }
});

// --- Functions ---

const clearForm = () => {
    error.value = null;
    password.value = '';
    phoneNumber.value = '';
    verificationCode.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
}

const handleLogin = () => {
  if (username.value === 'checksky' && password.value === userDatabase.value.checksky) {
    clearForm();
    emit('login-success');
  } else {
    error.value = '帳號或密碼錯誤，請重新輸入';
    password.value = '';
  }
};

const showForgotPassword = () => {
  clearForm();
  viewState.value = 'forgotPassword';
};

const handleSendCode = () => {
  // Basic phone number validation (example)
  if (phoneNumber.value.length < 10) {
      error.value = '請輸入有效的手機號碼';
      return;
  }
  clearForm();
  // Simulate sending code
  viewState.value = 'enterCode';
};

const handleVerifyCode = () => {
  if (verificationCode.value === '1234') { // Simulated verification code
    clearForm();
    viewState.value = 'resetPassword';
  } else {
    error.value = '驗證碼錯誤';
    verificationCode.value = '';
  }
};

const handleResetPassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = '兩次輸入的密碼不一致';
    return;
  }
  if (newPassword.value.length < 4) {
      error.value = '密碼長度至少需要4位';
      return;
  }
  
  // Simulate updating the password in our 'database'
  userDatabase.value[username.value] = newPassword.value;
  
  clearForm();
  viewState.value = 'success';
};

const backToLogin = () => {
  clearForm();
  viewState.value = 'login';
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