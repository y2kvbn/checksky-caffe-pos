<template>
  <form @submit.prevent="handleSendCode">
     <p class="form-instruction">請輸入您的手機號碼以接收驗證碼。</p>
    <div class="input-group">
      <i class="fas fa-mobile-alt"></i>
      <input type="tel" v-model="phoneNumber" placeholder="手機號碼" required>
    </div>
    <button type="submit" class="btn-login">發送驗證碼</button>
     <div class="form-footer">
        <a href="#" @click.prevent="$emit('backToLogin')" class="back-link">返回登入</a>
    </div>
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
/* Styles from Login.vue */
</style>
