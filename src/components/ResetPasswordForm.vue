<template>
  <form @submit.prevent="handleResetPassword">
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
        <a href="#" @click.prevent="$emit('backToLogin')" class="back-link">返回登入</a>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['showSuccess', 'backToLogin']);

const newPassword = ref('');
const confirmPassword = ref('');
const error = ref<string | null>(null);

const handleResetPassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = '兩次輸入的密碼不一致';
    return;
  }
  if (newPassword.value.length < 4) {
      error.value = '密碼長度至少需要4位';
      return;
  }
  
  emit('showSuccess');
};
</script>

<style scoped>
/* Styles from Login.vue */
</style>
