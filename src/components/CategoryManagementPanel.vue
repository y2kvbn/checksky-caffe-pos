<template>
  <div class="category-management-panel">
    <h3 class="panel-title">分類管理</h3>
    <div class="category-list">
      <div v-for="category in categories" :key="category" class="category-item" :class="{ active: selectedCategory === category }" @click="emit('update:selectedCategory', category)">
        <span class="category-name">{{ category }}</span>
        <div class="category-actions">
          <button @click.stop="openCategoryModal('edit', category)" class="action-btn edit-btn">✏️</button>
          <button @click.stop="handleDeleteCategory(category)" class="action-btn delete-btn">❌</button>
        </div>
      </div>
    </div>
    <button class="btn-add-category" @click="openCategoryModal('add')">+ 新增分類</button>

    <div v-if="isCategoryModalOpen" class="modal-overlay" @click.self="closeCategoryModal">
      <div class="modal-content">
        <h3>{{ categoryModalMode === 'add' ? '新增分類' : '編輯分類' }}</h3>
        <form @submit.prevent="handleCategorySubmit">
          <div class="form-group">
            <label for="categoryName">分類名稱</label>
            <input type="text" id="categoryName" v-model="currentCategoryName" required>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeCategoryModal">取消</button>
            <button type="submit">{{ categoryModalMode === 'add' ? '新增' : '儲存' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMenuStore } from '../stores/menu';

const menuStore = useMenuStore();
const { categories } = storeToRefs(menuStore);
const { addCategory, updateCategory, deleteCategory } = menuStore;

const props = defineProps<{ selectedCategory: string }>();
const emit = defineEmits(['update:selectedCategory']);

const isCategoryModalOpen = ref(false);
const categoryModalMode = ref('add');
const currentCategoryName = ref('');
const originalCategoryName = ref('');

const openCategoryModal = (mode: string, category = '') => {
  categoryModalMode.value = mode;
  if (mode === 'edit') {
    currentCategoryName.value = category;
    originalCategoryName.value = category;
  } else {
    currentCategoryName.value = '';
    originalCategoryName.value = '';
  }
  isCategoryModalOpen.value = true;
};

const closeCategoryModal = () => {
  isCategoryModalOpen.value = false;
};

const handleCategorySubmit = () => {
  if (categoryModalMode.value === 'add') {
    addCategory(currentCategoryName.value);
  } else {
    updateCategory({ oldName: originalCategoryName.value, newName: currentCategoryName.value });
  }
  closeCategoryModal();
};

const handleDeleteCategory = (categoryName: string) => {
  if (confirm(`您確定要刪除分類 "${categoryName}" 嗎？此操作無法復原。`)) {
    deleteCategory(categoryName);
    if (props.selectedCategory === categoryName) {
      emit('update:selectedCategory', '全部');
    }
  }
};
</script>

<style scoped>
.panel-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.category-management-panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.category-list {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 15px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.category-item:hover,
.category-item.active {
  background-color: #f0e8f6;
}

.category-item.active .category-name {
  font-weight: bold;
  color: #8e44ad;
}

.category-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.category-item:hover .category-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.edit-btn:hover {
  color: #2980b9;
}

.delete-btn:hover {
  color: #c0392b;
}

.btn-add-category {
  width: 100%;
  padding: 12px;
  background-color: #e8e8e8;
  border: 1px dashed #ccc;
  border-radius: 8px;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-category:hover {
  background-color: #ddd;
  color: #333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 20px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 15px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 25px;
}

.form-actions button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-size: 15px;
  cursor: pointer;
}

.form-actions button[type="button"] {
  background-color: #e0e0e0;
}

.form-actions button[type="submit"] {
  background-color: #8e44ad;
  color: white;
}
</style>
