<template>
  <form @submit.prevent="handleSendCode" class="forgot-password-form">
    <p class="form-instruction">請輸入您的手機號碼以接收驗證碼。</p>

    <div class="input-group">
      <i class="fas fa-mobile-alt"></i>
      <input type="tel" v-model="phoneNumber" placeholder="手機號碼" required>
    </div>

    <button type="submit" class="btn-send-code">發送驗證碼</button>

    <a href="#" @click.prevent="$emit('backToLogin')" class="back-link">返回登入</a>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['showEnterCode', 'backToLogin']);

const phoneNumber = ref('');
const error = ref<string | null>(null);

const handleSendCode = () => {
  if (phoneNumber.value.length < 10) {
      error.value = '請輸入有效的手機號碼';
      return;
  }
  emit('showEnterCode');
};
</script>

<style scoped>
.forgot-password-form {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Solves the spacing issue */
  width: 100%;
}

.form-instruction {
  color: #666;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 1.5;
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
  font-size: 18px;
}

.input-group input {
  width: 100%;
  /* Increased padding for a larger feel */
  padding: 16px 20px 16px 50px;
  border: 1px solid #ddd;
  /* More rounded corners */
  border-radius: 12px;
  /* Larger font size */
  font-size: 17px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.25);
}

/* --- Button Styling --- */
.btn-send-code {
  width: 100%;
  /* Taller button */
  padding: 16px;
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.btn-send-code:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}

/* --- Back Link Styling --- */
.back-link {
  text-decoration: none;
  color: #007bff;
  font-weight: 500;
  text-align: center;
  display: block;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.7;
}
</style>
