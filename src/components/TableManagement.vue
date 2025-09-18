<template>
  <div class="table-management-container">
    <div class="title-container">
      <h2 class="title">桌號管理</h2>
      <button 
        v-if="tablesStore.tables.length > 0" 
        @click="handleDeleteAllTables" 
        class="delete-all-btn"
      >
        一鍵清空
      </button>
    </div>

    <!-- 新增桌號區域 -->
    <div class="add-table-card">
      <input 
        type="text" 
        v-model="newTableName" 
        placeholder="輸入新的桌號名稱 (例如: A1)"
        @keyup.enter="handleAddTable"
      />
      <button @click="handleAddTable">新增桌號</button>
    </div>

    <!-- 桌號列表 -->
    <div class="table-list-card">
      <h3 class="list-title">現有桌號</h3>
      <ul v-if="tablesStore.tables.length > 0">
        <li v-for="table in tablesStore.tables" :key="table.id">
          <span>{{ table.name }}</span>
          <div class="actions">
            <button class="edit" @click="handleEditTable(table)">編輯</button>
            <button class="delete" @click="handleDeleteTable(table.id)">刪除</button>
          </div>
        </li>
      </ul>
      <p v-else class="empty-message">尚未新增任何桌號。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTablesStore, type Table } from '../stores/tables';

const tablesStore = useTablesStore();
const newTableName = ref('');

// 新增桌號
const handleAddTable = () => {
  if (newTableName.value.trim()) {
    tablesStore.addTable(newTableName.value);
    newTableName.value = ''; // 清空輸入框
  }
};

// 編輯桌號
const handleEditTable = (table: Table) => {
  const newName = prompt(`請輸入「${table.name}」的新名稱：`, table.name);
  if (newName) {
    tablesStore.updateTable(table.id, newName);
  }
};

// 刪除桌號
const handleDeleteTable = (id: number) => {
  if (confirm('確定要刪除這個桌號嗎？此操作無法復原。')) {
    tablesStore.deleteTable(id);
  }
};

// 全部刪除
const handleDeleteAllTables = () => {
  if (confirm('您確定要刪除所有的桌號嗎？此操作將無法復原！')) {
    tablesStore.deleteAllTables();
  }
};
</script>

<style scoped>
.table-management-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0; /* Remove default margin */
}

.delete-all-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.delete-all-btn:hover {
  background-color: #c0392b;
}

.add-table-card, .table-list-card {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.add-table-card {
  display: flex;
  gap: 1rem;
}

.add-table-card input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.add-table-card button, .actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-table-card button {
  background-color: #007bff;
  color: white;
}

.add-table-card button:hover {
  background-color: #0056b3;
}

.list-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.75rem;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

li:last-child {
  border-bottom: none;
}

li span {
  font-size: 1.1rem;
  color: #555;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.actions button {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
}

.actions .edit {
    background-color: #ffc107; /* Yellow */
    color: #333;
}
.actions .edit:hover {
    background-color: #e0a800;
}

.actions .delete {
    background-color: #dc3545; /* Red */
    color: white;
}
.actions .delete:hover {
    background-color: #c82333;
}

.empty-message {
  color: #888;
  text-align: center;
  padding: 2rem;
}
</style>
