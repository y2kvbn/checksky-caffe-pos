<template>
  <main class="timeline-main">
    <div class="timeline-header">
      <h3>{{ sidebarTitle }}</h3>
    </div>
    <div class="timeline-content">
      <ul class="reservation-list" v-if="reservationsForSelectedDate.length > 0">
        <li v-for="reservation in reservationsForSelectedDate" :key="reservation.id" class="reservation-item">
          <div class="item-time">{{ reservation.time }}</div>
          <div class="item-details">
            <span class="item-name">{{ reservation.name }}</span>
            <div class="item-meta">
              <span><span class="meta-icon">&#128101;</span> {{ reservation.guests }} 位</span>
              <span v-if="reservation.tableId"><span class="meta-icon">&#129681;</span> {{ getTableName(reservation.tableId) }}</span>
              <span v-if="reservation.babyChairs > 0"><span class="meta-icon">&#128118;</span> {{ reservation.babyChairs }} 張嬰兒座椅</span>
            </div>
            <p v-if="reservation.notes" class="item-notes"><b>備註:</b> {{ reservation.notes }}</p>
          </div>
          <div class="item-actions">
            <button class="btn-icon" @click="$emit('openEditModal', reservation)" title="編輯">&#9998;</button>
            <button class="btn-icon btn-delete" @click="$emit('confirmDelete', reservation.id)" title="刪除">&#128465;</button>
          </div>
        </li>
      </ul>
      <div v-else class="no-reservations">
        <p>本日無訂位紀錄</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTablesStore } from '../stores/tables';

const props = defineProps<{ 
  sidebarTitle: string, 
  reservationsForSelectedDate: any[]
}>();

const tablesStore = useTablesStore();
const { tables } = storeToRefs(tablesStore);

const tableMap = computed(() => {
  return tables.value.reduce((acc, table) => {
    acc[table.id] = table.name;
    return acc;
  }, {});
});

const getTableName = (tableId: string) => {
  return tableMap.value[tableId] || '未指定';
};

defineEmits<{
  (e: 'openEditModal', reservation: any): void;
  (e: 'confirmDelete', reservationId: string): void;
}>();
</script>

<style scoped>
.timeline-main {
  background: var(--card-background);
  border-radius: 12px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.timeline-header {
  padding: 20px 25px;
  border-bottom: 1px solid var(--border-color);
  background-color: #fafafa;
}

.timeline-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.timeline-content {
  overflow-y: auto;
}

.reservation-list {
  list-style: none;
  padding: 25px;
  margin: 0;
}

.reservation-item {
  display: flex;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid var(--border-color);
  background: #fff;
  transition: all 0.2s ease;
}

.reservation-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.item-time {
  font-size: 20px;
  font-weight: bold;
  color: var(--primary-color);
  width: 80px;
  flex-shrink: 0;
}

.item-details {
  flex-grow: 1;
}

.item-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  color: var(--text-light);
  font-size: 14px;
  margin-top: 5px;
}

.item-notes {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
  background-color: #f9f9f9;
  border-left: 3px solid var(--primary-color);
  padding: 8px 12px;
}

.meta-icon {
  margin-right: 5px;
}

.item-actions {
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.2s;
}

.reservation-item:hover .item-actions {
  opacity: 1;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #aaa;
  padding: 5px;
}

.btn-icon:hover {
  color: #333;
}

.btn-icon.btn-delete:hover {
  color: #e74c3c;
}

.no-reservations {
  text-align: center;
  color: var(--text-light);
  padding: 50px 0;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
</style>