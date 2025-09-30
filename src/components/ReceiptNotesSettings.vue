<template>
  <div class="settings-card">
    <h3><i class="fas fa-receipt"></i> 收據備註文字</h3>
    <p>顯示於訂單收據最下方的文字欄位。</p>
    <textarea v-model="localReceiptNotes" rows="4" placeholder="例如：感謝您的光臨，歡迎再次惠顧！"></textarea>
    <button class="btn btn-primary" @click="saveReceiptNotes">儲存備註</button>
    <p v-if="showNotesSuccessMessage" class="success-message">備註已更新！</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '../stores/settings';

const settingsStore = useSettingsStore();
const localReceiptNotes = ref('');
const showNotesSuccessMessage = ref(false);

onMounted(() => {
  localReceiptNotes.value = settingsStore.receiptNotes;
});

const saveReceiptNotes = () => {
  settingsStore.updateReceiptNotes(localReceiptNotes.value);
  showNotesSuccessMessage.value = true;
  setTimeout(() => {
    showNotesSuccessMessage.value = false;
  }, 2000);
};
</script>

<style scoped>
.settings-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  padding: 25px;
  margin-bottom: 25px;
}

.settings-card h3 {
  font-size: 20px;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.settings-card p {
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.5;
}

.btn-primary {
  background-color: #ff6b6b;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.success-message {
  color: #28a745;
  font-weight: bold;
  margin-top: 15px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  line-height: 1.6;
}
</style>
