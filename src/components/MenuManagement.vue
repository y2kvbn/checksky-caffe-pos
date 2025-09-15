
<template>
  <div class="menu-management">
    <h2>菜單管理</h2>
    
    <!-- Category Filters -->
    <div class="categories">
      <button 
        v-for="category in categories" 
        :key="category"
        @click="selectedCategory = category"
        :class="{ active: selectedCategory === category }"
      >
        {{ category }}
      </button>
    </div>

    <!-- Menu Items Grid -->
    <div class="menu-items">
      <!-- Add New Item Card -->
      <div class="add-item-card" @click="openModal()">
          <div class="plus-icon">+</div>
          <div>新增品項</div>
      </div>
      
      <!-- Menu Item Cards -->
      <div v-for="item in filteredItems" :key="item.id" class="menu-item-card">
        <img :src="item.image" :alt="item.name">
        <div class="item-details">
            <h4>{{ item.name }}</h4>
            <p>NT${{ item.price }}</p>
        </div>
        <div class="item-actions">
            <button @click="openModal(item)">編輯</button>
            <button @click="handleDeleteItem(item.id)" class="delete-btn">刪除</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ modalMode === 'add' ? '新增品項' : '編輯品項' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">名稱</label>
            <input type="text" id="name" v-model="currentItem.name" required>
          </div>
          <div class="form-group">
            <label for="category">分類</label>
            <input type="text" id="category" v-model="currentItem.category" required>
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
            <button type="button" @click="closeModal">取消</button>
            <button type="submit">{{ modalMode === 'add' ? '新增' : '儲存' }}</button>
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
const { addItem, updateItem, deleteItem } = menuStore;

// --- Component State ---
const selectedCategory = ref('全部'); // Default to showing all items
const isModalOpen = ref(false);
const modalMode = ref('add'); // 'add' or 'edit'
const currentItem = ref({});

// --- Computed Properties ---
const filteredItems = computed(() => {
  if (selectedCategory.value === '全部') {
    return items.value;
  }
  return items.value.filter(item => item.category === selectedCategory.value);
});

// --- Modal Methods ---
function openModal(item = null) {
  if (item) {
    // Edit mode
    modalMode.value = 'edit';
    currentItem.value = { ...item }; // Copy to avoid direct mutation
  } else {
    // Add mode
    modalMode.value = 'add';
    currentItem.value = { name: '', category: '', price: null, image: '' };
  }
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

// --- Form & Data Methods ---
function handleSubmit() {
  if (modalMode.value === 'add') {
    addItem(currentItem.value);
  } else {
    updateItem(currentItem.value);
  }
  closeModal();
}

function handleDeleteItem(itemId) {
    // Add a confirmation dialog for a better user experience
    if (confirm('您確定要刪除這個品項嗎？')) {
        deleteItem(itemId);
    }
}
</script>

<style scoped>
/* Basic component styles remain the same */
.menu-management {
    padding: 25px;
    color: #333;
}

.menu-management h2 {
    font-size: 28px;
    margin-bottom: 25px;
}

.categories {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.categories button {
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background-color: #f7f7f7;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.categories button.active, .categories button:hover {
  background-color: #ffb997;
  color: #fff;
  border-color: #ffb997;
}

.menu-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
}

.menu-item-card, .add-item-card {
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.08);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.menu-item-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 22px rgba(0,0,0,0.12);
}

.add-item-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 2px dashed #ddd;
    color: #aaa;
    min-height: 290px;
}

.add-item-card:hover {
    background-color: #f9f9f9;
    border-color: #ffb997;
    color: #ffb997;
}

.plus-icon {
    font-size: 48px;
    font-weight: 300;
}

.menu-item-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.item-details {
  padding: 15px;
}

.item-details h4 {
  margin: 0 0 5px 0;
  font-size: 18px;
}

.item-details p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.item-actions {
  padding: 0 15px 15px 15px;
  display: flex;
  gap: 10px;
}

.item-actions button {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f0f0f0;
    cursor: pointer;
}

.item-actions .delete-btn {
    background-color: #fff0f0;
    color: #dc3545;
    border-color: #f7d9d9;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.modal-content h3 {
    margin-top: 0;
    margin-bottom: 25px;
    font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.form-actions button {
  padding: 10px 25px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.form-actions button[type="button"] {
  background-color: #f0f0f0;
}

.form-actions button[type="submit"] {
  background-color: #ffb997;
  color: white;
}
</style>
