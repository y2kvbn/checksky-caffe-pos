<template>
  <aside class="category-sidebar">
    <h2>分類</h2>
    <ul class="category-list">
      <li v-for="category in allCategories" :key="category" :class="{ active: category === activeCategory }" @click="emit('update:activeCategory', category)">
        {{ category }}
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { useMenuStore } from '../stores/menu';
import { storeToRefs } from 'pinia';

const menuStore = useMenuStore();
const { allCategories } = storeToRefs(menuStore);

defineProps<{ activeCategory: string }>();
const emit = defineEmits(['update:activeCategory']);

</script>

<style scoped>
.category-sidebar {
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  width: 240px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  /* Magic fix for flex/grid children */
}

.category-sidebar h2 {
  font-size: 22px;
  color: var(--text-dark);
  margin-top: 0;
  margin-bottom: 25px;
  flex-shrink: 0;
}

.category-sidebar .category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}

.category-sidebar li {
  padding: 14px 18px;
  margin-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-light);
  transition: all 0.2s ease-in-out;
}

.category-sidebar li:hover {
  background-color: #fef4f4;
  color: var(--primary-color);
}

.category-sidebar li.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: bold;
}
</style>
