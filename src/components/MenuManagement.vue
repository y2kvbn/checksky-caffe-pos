<template>
  <div class="menu-management">
    <h2>菜單管理</h2>
    <div class="categories">
      <button 
        v-for="category in categories" 
        :key="category.id"
        @click="selectedCategory = category.id"
        :class="{ active: selectedCategory === category.id }"
      >
        {{ category.name }}
      </button>
    </div>
    <div class="menu-items">
      <div class="add-item-card" @click="showAddItemModal = true">
          <div class="plus-icon">+</div>
          <div>新增品項</div>
      </div>
      <div v-for="item in filteredItems" :key="item.id" class="menu-item-card">
        <img :src="item.image" :alt="item.name">
        <div class="item-details">
            <h4>{{ item.name }}</h4>
            <p>NT${{ item.price }}</p>
        </div>
        <div class="item-actions">
            <button @click="editItem(item)">編輯</button>
            <button @click="deleteItem(item.id)" class="delete-btn">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const categories = ref([
  { id: 1, name: '特色風味簡餐' },
  { id: 2, name: '單品咖啡' },
  { id: 3, name: '義式咖啡' },
  { id: 4, name: '茶' },
  { id: 5, name: '無咖啡因飲品' },
  { id: 6, name: '甜點' },
  { id: 7, name: '炸物' },
]);

const items = ref([
    { id: 1, categoryId: 1, name: '風味烤雞腿排', price: 280, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop' },
    { id: 2, categoryId: 1, name: '紅酒燉牛肉', price: 320, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1614&auto=format&fit=crop' },
    { id: 3, categoryId: 2, name: '手沖肯亞', price: 180, image: 'https://images.unsplash.com/photo-1512568400610-62da2848a098?q=80&w=1587&auto=format&fit=crop' },
    { id: 4, categoryId: 3, name: '經典拿鐵', price: 150, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop' },
    { id: 5, categoryId: 6, name: '提拉米蘇', price: 120, image: 'https://images.unsplash.com/photo-1586985289906-406d13c33599?q=80&w=1587&auto=format&fit=crop' },
]);

const selectedCategory = ref(1);
const showAddItemModal = ref(false);

const filteredItems = computed(() => {
  return items.value.filter(item => item.categoryId === selectedCategory.value);
});

function editItem(item) {
  // Logic to show an edit modal
  console.log('Editing', item);
}

function deleteItem(itemId) {
  // Logic to delete an item
  console.log('Deleting', itemId);
  items.value = items.value.filter(item => item.id !== itemId);
}
</script>

<style scoped>
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
</style>
