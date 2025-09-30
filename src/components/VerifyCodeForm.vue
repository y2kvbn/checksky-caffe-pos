<template>
  <form @submit.prevent="handleVerifyCode">
    <p class="form-instruction">我們已發送一組 4 位數驗證碼到您的手機。<br>(模擬驗證碼: 1234)</p>
    <div class="input-group">
      <i class="fas fa-key"></i>
      <input type="text" v-model="verificationCode" placeholder="4位數驗證碼" required maxlength="4">
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
    <button type="submit" class="btn-login">驗證</button>
     <div class="form-footer">
        <a href="#" @click.prevent="$emit('backToLogin')" class="back-link">返回登入</a>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['showResetPassword', 'backToLogin']);

const verificationCode = ref('');
const error = ref<string | null>(null);

const handleVerifyCode = () => {
  if (verificationCode.value === '1234') { // Simulated verification code
    emit('showResetPassword');
  } else {
    error.value = '驗證碼錯誤';
    verificationCode.value = '';
  }
};
</script>

<style scoped>
/* Styles from Login.vue */
</style>
