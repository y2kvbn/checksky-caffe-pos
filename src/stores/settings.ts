import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

// 1. localStorage 的鍵與預設值
const NOTES_STORAGE_KEY = 'caffe_pos_receipt_notes';
const DEFAULT_NOTES = '《向天湖咖啡民宿感謝您的光臨》'; // [MODIFIED]

export const useSettingsStore = defineStore('settings', () => {
  // 2. 從 localStorage 初始化 State，若無則使用預設值
  const receiptNotes = ref<string>(
    localStorage.getItem(NOTES_STORAGE_KEY) || DEFAULT_NOTES
  );

  // 3. 使用 Watcher 自動儲存到 localStorage
  watch(receiptNotes, (newNotes) => {
    localStorage.setItem(NOTES_STORAGE_KEY, newNotes);
  });

  // 4. Actions
  function updateReceiptNotes(newNotes: string) {
    receiptNotes.value = newNotes;
  }

  function resetReceiptNotes() {
    receiptNotes.value = DEFAULT_NOTES;
  }

  // 5. 返回狀態和動作
  return {
    receiptNotes,
    updateReceiptNotes,
    resetReceiptNotes,
  };
});
