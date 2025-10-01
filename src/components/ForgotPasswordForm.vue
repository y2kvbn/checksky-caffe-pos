<template>
  <form @submit.prevent="handlePasswordReset" class="forgot-password-form">
    <p class="form-instruction">請輸入您註冊時使用的電子郵件，我們將會寄送密碼重設說明至您的信箱。</p>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="input-group">
      <i class="fas fa-envelope"></i>
      <input type="email" v-model="email" placeholder="電子郵件" required>
    </div>

    <button type="submit" class="btn-send-code" :disabled="isLoading">
      {{ isLoading ? '傳送中...' : '傳送重設郵件' }}
    </button>

    <a href="#" @click.prevent="$emit('backToLogin')" class="back-link">返回登入</a>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const emit = defineEmits(['reset-email-sent', 'backToLogin']);

const email = ref('');
const errorMessage = ref<string | null>(null);
const isLoading = ref(false);

const auth = getAuth();

const handlePasswordReset = async () => {
  if (!email.value) {
    errorMessage.value = '請輸入您的電子郵件地址。';
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    await sendPasswordResetEmail(auth, email.value);
    emit('reset-email-sent');
  } catch (error: any) {
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage.value = '電子郵件格式不正確，請重新輸入。';
        break;
      case 'auth/user-not-found':
        errorMessage.value = '此電子郵件尚未註冊，請確認輸入是否正確。';
        break;
      default:
        errorMessage.value = '發生未知錯誤，請稍後再試或聯繫客服。';
        break;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.forgot-password-form {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Adjusted gap */
  width: 100%;
}

.form-instruction {
  color: #666;
  margin-bottom: 5px; /* Adjusted margin */
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
}

.error-message {
  color: #e74c3c;
  background-color: #fdd;
  border: 1px solid #e74c3c;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 14px;
  text-align: center;
}


/* --- Input Field Styling --- */
.input-group {
  position: relative;
}

.input-group i {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 16px; /* Adjusted icon size */
}

.input-group input {
  width: 100%;
  padding: 14px 20px 14px 50px; /* Adjusted padding */
  border: 1px solid #ddd;
  border-radius: 10px; /* Adjusted border-radius */
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
}

/* --- Button Styling --- */
.btn-send-code {
  width: 100%;
  padding: 14px;
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.btn-send-code:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(255, 107, 107, 0.5);
}

.btn-send-code:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

/* --- Back Link Styling --- */
.back-link {
  text-decoration: none;
  color: #007bff;
  font-weight: 500;
  text-align: center;
  display: block;
  transition: opacity 0.2s;
  margin-top: 5px; /* Adjusted margin */
}

.back-link:hover {
  opacity: 0.7;
}
</style>
