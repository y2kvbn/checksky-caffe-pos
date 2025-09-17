
<template>
  <div class="menu-management-container">
    <!-- Left Column: Category Management -->
    <div class="category-management-panel">
      <h3 class="panel-title">分類管理</h3>
      <div class="category-list">
        <div 
          v-for="category in categories" 
          :key="category"
          class="category-item"
          :class="{ active: selectedCategory === category }"
          @click="selectedCategory = category"
        >
          <span class="category-name">{{ category }}</span>
          <div class="category-actions">
            <button @click.stop="openCategoryModal('edit', category)" class="action-btn edit-btn">✏️</button>
            <button @click.stop="handleDeleteCategory(category)" class="action-btn delete-btn">❌</button>
          </div>
        </div>
      </div>
      <button class="btn-add-category" @click="openCategoryModal('add')">+ 新增分類</button>
    </div>

    <!-- Right Column: Menu Items -->
    <div class="menu-items-panel">
      <div class="panel-header">
        <h3 class="panel-title">{{ selectedCategory === '全部' ? '所有品項' : selectedCategory }}</h3>
        <button class="btn-add-item" @click="openItemModal()">+ 新增品項至此分類</button>
      </div>
      <div class="menu-items-grid">
        <div v-for="item in filteredItems" :key="item.id" class="menu-item-card">
          <img :src="item.image" :alt="item.name">
          <div class="item-details">
            <h4>{{ item.name }}</h4>
            <p>NT${{ item.price }}</p>
          </div>
          <div class="item-actions">
            <button @click="openItemModal(item)">編輯</button>
            <button @click="handleDeleteItem(item.id)" class="delete-btn">刪除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Add/Edit Modal -->
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

    <!-- Item Add/Edit Modal -->
    <div v-if="isItemModalOpen" class="modal-overlay" @click.self="closeItemModal">
      <div class="modal-content">
        <h3>{{ itemModalMode === 'add' ? '新增品項' : '編輯品項' }}</h3>
        <form @submit.prevent="handleItemSubmit">
          <div class="form-group">
            <label for="name">名稱</label>
            <input type="text" id="name" v-model="currentItem.name" required>
          </div>
          <div class="form-group">
            <label for="category">分類</label>
            <select id="category" v-model="currentItem.category" required>
                <option disabled value="">請選擇一個分類</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="price">價格</label>
            <input type="number" id="price" v-model.number="currentItem.price" required>
          </div>
          <div class="form-group">
            <label for="image">圖片網址</label>
            <input type="text" id="image" v-model="currentItem.image">
          </div>
          <div class="form-actions">
            <button type="button" @click="closeItemModal">取消</button>
            <button type="submit">{{ itemModalMode === 'add' ? '新增' : '儲存' }}</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMenuStore } from '../stores/menu';

// --- Pinia Store ---
const menuStore = useMenuStore();
const { items, categories } = storeToRefs(menuStore);
const { addItem, updateItem, deleteItem, addCategory, updateCategory, deleteCategory } = menuStore;

// --- Component State ---
const selectedCategory = ref(categories.value[0] || '全部');

// Item Modal State
const isItemModalOpen = ref(false);
const itemModalMode = ref('add'); // 'add' or 'edit'
const currentItem = ref({});

// Category Modal State
const isCategoryModalOpen = ref(false);
const categoryModalMode = ref('add');
const currentCategoryName = ref('');
const originalCategoryName = ref('');

// --- Computed Properties ---
const filteredItems = computed(() => {
  if (selectedCategory.value === '全部') {
    return items.value;
  }
  return items.value.filter(item => item.category === selectedCategory.value);
});

// --- Item Modal Methods ---
function openItemModal(item = null) {
  if (item) {
    itemModalMode.value = 'edit';
    currentItem.value = { ...item };
  } else {
    itemModalMode.value = 'add';
    currentItem.value = { name: '', category: selectedCategory.value !== '全部' ? selectedCategory.value : '', price: null, image: '' };
  }
  isItemModalOpen.value = true;
}

function closeItemModal() {
  isItemModalOpen.value = false;
}

function handleItemSubmit() {
  if (itemModalMode.value === 'add') {
    addItem(currentItem.value);
  } else {
    updateItem(currentItem.value);
  }
  closeItemModal();
}

function handleDeleteItem(itemId) {
    if (confirm('您確定要刪除這個品項嗎？')) {
        deleteItem(itemId);
    }
}

// --- Category Modal Methods ---
function openCategoryModal(mode, category = '') {
  categoryModalMode.value = mode;
  if (mode === 'edit') {
    currentCategoryName.value = category;
    originalCategoryName.value = category;
  } else {
    currentCategoryName.value = '';
    originalCategoryName.value = '';
  }
  isCategoryModalOpen.value = true;
}

function closeCategoryModal() {
  isCategoryModalOpen.value = false;
}

function handleCategorySubmit() {
  if (categoryModalMode.value === 'add') {
    addCategory(currentCategoryName.value);
  } else {
    updateCategory({ oldName: originalCategoryName.value, newName: currentCategoryName.value });
  }
  closeCategoryModal();
}

function handleDeleteCategory(categoryName) {
    if (confirm(`您確定要刪除分類 "${categoryName}" 嗎？此操作無法復原。`)) {
        deleteCategory(categoryName);
        if (selectedCategory.value === categoryName) {
            selectedCategory.value = '全部';
        }
    }
}

</script>

<style scoped>
.menu-management-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  padding: 25px;
  height: 100%;
  background-color: #f9f9f9;
}

.panel-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

/* Category Panel */
.category-management-panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
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

.category-item:hover, .category-item.active {
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
  background: none; border: none; cursor: pointer; font-size: 16px;
}
.edit-btn:hover { color: #2980b9; }
.delete-btn:hover { color: #c0392b; }

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
.btn-add-category:hover { background-color: #ddd; color: #333; }

/* Menu Items Panel */
.menu-items-panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex; flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-add-item {
  padding: 10px 18px;
  border: none;
  background-color: #8e44ad;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-add-item:hover { background-color: #9b59b6; }

.menu-items-grid {
  flex-grow: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding-top: 20px;
  align-content: start;
}

/* Card Styles */
.menu-item-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.07);
    overflow: hidden;
    display: flex; flex-direction: column;
}

.menu-item-card img { width: 100%; height: 130px; object-fit: cover; }
.item-details { padding: 12px; }
.item-details h4 { margin: 0 0 5px 0; font-size: 17px; }
.item-details p { margin: 0; color: #666; font-size: 15px; }
.item-actions { padding: 12px; margin-top: auto; display: flex; gap: 8px; }

.item-actions button {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    background-color: #f2f2f2; border: 1px solid #e0e0e0;
}
.item-actions .delete-btn { background-color: #fbebeb; border-color: #f5c6cb; color: #721c24; }

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: white; padding: 25px; border-radius: 12px; width: 90%; max-width: 450px; }
.modal-content h3 { margin-top: 0; margin-bottom: 25px; font-size: 20px; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; }
.form-group input, .form-group select { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; font-size: 15px; }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 25px; }
.form-actions button { padding: 10px 20px; border-radius: 6px; border: none; font-size: 15px; cursor: pointer; }
.form-actions button[type="button"] { background-color: #e0e0e0; }
.form-actions button[type="submit"] { background-color: #8e44ad; color: white; }

</style>
