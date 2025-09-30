<template>
  <div class="menu-management-container">
    <CategoryManagementPanel :selectedCategory="selectedCategory" @update:selectedCategory="selectedCategory = $event" />
    <MenuItemsPanel :selectedCategory="selectedCategory" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMenuStore } from '../stores/menu';
import CategoryManagementPanel from './CategoryManagementPanel.vue';
import MenuItemsPanel from './MenuItemsPanel.vue';

const menuStore = useMenuStore();
const { categories } = storeToRefs(menuStore);

const selectedCategory = ref(categories.value[0] || '全部');
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
</style>
