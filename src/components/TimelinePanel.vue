<template>
  <div class="timeline-panel-container">
    <h3 class="sidebar-title">{{ sidebarTitle }}</h3>
    <div class="timeline-wrapper">
      <div v-if="reservationsForSelectedDate.length === 0" class="no-reservations">
        <p>本日尚無訂位</p>
      </div>
      <div v-else class="timeline-list">
        <div v-for="reservation in reservationsForSelectedDate" :key="reservation.id" class="timeline-item">
          <div class="timeline-time">{{ reservation.time }}</div>
          <div class="timeline-card">
            <div class="card-header">
              <div class="header-left">
                <span class="guest-name">{{ reservation.name }}</span>
                <div class="guest-info">
                  <span><i class="fas fa-users"></i> {{ reservation.guests }} 位</span>
                  <span v-if="reservation.babyChairs > 0"><i class="fas fa-child"></i> {{ reservation.babyChairs }}</span>
                </div>
              </div>
              <span class="table-info">預訂座位：{{ getTableName(reservation.tableId) }}</span>
            </div>
            <div class="card-body">
              <p v-if="reservation.phone"><i class="fas fa-phone"></i> {{ reservation.phone }}</p>
              <p v-if="reservation.notes"><i class="fas fa-comment-alt"></i> {{ reservation.notes }}</p>
            </div>
            <div class="card-actions">
              <button @click="$emit('openEditModal', reservation)">編輯</button>
              <button @click="$emit('confirmDelete', reservation.id)" class="delete-btn">刪除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTablesStore } from '../stores/tables';

const props = defineProps<{ 
  sidebarTitle: string, 
  reservationsForSelectedDate: any[] 
}>();

const tablesStore = useTablesStore();
const { tables } = storeToRefs(tablesStore);

const getTableName = (tableId: string | null) => {
  if (!tableId) return '未安排桌位';
  const table = tables.value.find(t => t.id === tableId);
  return table ? table.name : '桌位不存在';
};
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';

.timeline-panel-container { background-color: var(--card-background); border-radius: 12px; padding: 25px; display: flex; flex-direction: column; box-shadow: var(--shadow); }
.sidebar-title { text-align: center; margin-top: 0; margin-bottom: 25px; color: var(--text-dark); font-size: 1.5rem; }
.timeline-wrapper { flex-grow: 1; overflow-y: auto; }
.no-reservations { text-align: center; color: var(--text-light); padding-top: 40px; font-size: 1.2rem; }
.timeline-list { padding-right: 15px; }
.timeline-item { display: flex; margin-bottom: 25px; }
.timeline-time { flex-shrink: 0; width: 75px; font-weight: bold; color: var(--primary-color); font-size: 1.2rem; padding-top: 5px; }
.timeline-card { flex-grow: 1; background: #f9f9f9; border-radius: 8px; padding: 18px; border-left: 4px solid var(--secondary-color); }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 15px;
  margin-bottom: 15px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 15px;
  flex-wrap: wrap; /* Allow wrapping if needed on small screens */
}

.guest-name { font-weight: bold; font-size: 1.4rem; }
.guest-info { display: flex; align-items: center; gap: 15px; font-size: 1.1rem; color: #555; }
.guest-info span { display: flex; align-items: center; gap: 6px; }

.table-info {
  background-color: #e9ecef;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 1rem;
  flex-shrink: 0; /* Prevent it from shrinking */
  white-space: nowrap; /* Prevent text wrapping */
}

.card-body { padding-top: 5px; } /* Minor adjustment */
.card-body p { margin: 10px 0; color: var(--text-light); display: flex; align-items: center; font-size: 1.1rem; }
.card-body p i { margin-right: 12px; color: #95a5a6; width: 18px; text-align: center; }

.card-actions { margin-top: 20px; text-align: right; }
.card-actions button { background: none; border: 1px solid #bdc3c7; color: #7f8c8d; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-left: 10px; transition: all 0.2s; font-size: 1rem; }
.card-actions button:hover { background: #ecf0f1; border-color: #95a5a6; }
.card-actions .delete-btn { border-color: #e74c3c; color: #e74c3c; }
.card-actions .delete-btn:hover { background: #e74c3c; color: white; }
</style>
