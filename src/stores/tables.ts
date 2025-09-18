import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';

export interface Table {
  id: number;
  name: string;
}

export const useTablesStore = defineStore('tables', () => {
  // --- STATE ---
  const tables = ref<Table[]>([]);
  const nextId = ref(1);

  // --- ACTIONS ---

  function loadTablesFromStorage() {
    const storedTables = localStorage.getItem('restaurant_tables');
    if (storedTables) {
      tables.value = JSON.parse(storedTables);
      if (tables.value.length > 0) {
        nextId.value = Math.max(...tables.value.map(t => t.id)) + 1;
      }
    }
  }

  function saveTablesToStorage() {
    localStorage.setItem('restaurant_tables', JSON.stringify(tables.value));
  }

  function addTable(name: string) {
    if (!name.trim()) return;
    const newTable: Table = {
      id: nextId.value,
      name: name.trim(),
    };
    tables.value.push(newTable);
    nextId.value++;
    saveTablesToStorage();
  }

  function updateTable(id: number, newName: string) {
    if (!newName.trim()) return;
    const table = tables.value.find(t => t.id === id);
    if (table) {
      table.name = newName.trim();
      saveTablesToStorage();
    }
  }

  function deleteTable(id: number) {
    const index = tables.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tables.value.splice(index, 1);
      saveTablesToStorage();
    }
  }

  function deleteAllTables() {
    tables.value = [];
    nextId.value = 1;
    saveTablesToStorage();
  }

  // --- LIFECYCLE ---
  onMounted(() => {
    loadTablesFromStorage();
  });

  return {
    tables,
    addTable,
    updateTable,
    deleteTable,
    deleteAllTables, // Expose the new action
  };
});
