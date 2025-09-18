<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3 class="modal-title">請選擇桌號</h3>
      <div class="table-grid">
        <button 
          v-for="table in tablesStore.tables" 
          :key="table.id" 
          class="table-button"
          @click="selectTable(table)"
        >
          {{ table.name }}
        </button>
      </div>
      <div v-if="tablesStore.tables.length === 0" class="no-tables-message">
        <p>尚未設定任何桌號。</p>
        <p>請至「桌號管理」頁面新增桌號。</p>
      </div>
      <div class="modal-actions">
        <button class="btn-cancel" @click="closeModal">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTablesStore, type Table } from '../stores/tables';

const props = defineProps<{ isVisible: boolean }>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'select-table', table: Table): void; }>();

const tablesStore = useTablesStore();

const selectTable = (table: Table) => {
  emit('select-table', table);
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 600px;
  text-align: center;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.table-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.table-button {
  padding: 1rem 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.table-button:hover {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.no-tables-message {
    color: #888;
    text-align: center;
    padding: 2rem;
    border: 2px dashed #ddd;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
}

.btn-cancel {
  padding: 0.75rem 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f1f1f1;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}
</style>
