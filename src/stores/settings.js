import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  // State
  const receiptNotes = ref('感謝您的光臨，歡迎再次惠顧！\n*** 發票為電子發票，請至財政部網站查詢 ***');

  // Actions
  function updateReceiptNotes(newNotes) {
    receiptNotes.value = newNotes;
  }

  return {
    receiptNotes,
    updateReceiptNotes,
  };
});
