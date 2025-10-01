<template>
  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">{{ modalMode === 'add' ? '新增' : '編輯' }}訂位</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">訂位姓名:</label>
          <input type="text" id="name" v-model="currentReservation.name" required>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label for="date">訂位日期:</label>
            <input type="date" id="date" v-model="currentReservation.date" required>
          </div>
          <div class="form-group">
            <label for="time">訂位時間:</label>
            <input type="time" id="time" v-model="currentReservation.time" required>
          </div>
        </div>

        <!-- [NEW] Spinner Container -->
        <div class="spinner-container form-group">
          <NumberSpinner label="訂位人數" v-model="currentReservation.guests" :min="1" :max="50" />
          <NumberSpinner label="嬰兒座椅" v-model="currentReservation.babyChairs" :min="0" :max="10" />
        </div>

        <div class="form-group">
          <label for="table">安排桌號:</label>
          <select id="table" v-model="currentReservation.tableId">
            <option :value="null">稍後安排</option>
            <option v-for="table in tables" :key="table.id" :value="table.id">{{ table.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="notes">備註:</label>
          <textarea id="notes" v-model="currentReservation.notes" rows="3"></textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="$emit('closeModal')">取消</button>
          <button type="submit" class="btn btn-primary">{{ modalMode === 'add' ? '儲存' : '更新' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue';
import { storeToRefs } from 'pinia';
import { useTablesStore } from '../stores/tables';
import NumberSpinner from './NumberSpinner.vue'; // [NEW] Import the spinner component

const props = defineProps<{ 
  isModalVisible: boolean, 
  modalMode: string, 
  reservationData: any 
}>();

const { reservationData } = toRefs(props);

const tablesStore = useTablesStore();
const { tables } = storeToRefs(tablesStore);

const currentReservation = ref({ guests: 1, babyChairs: 0, ...props.reservationData });

watch(reservationData, (newVal) => {
  // Ensure defaults are set if not present
  currentReservation.value = {
    guests: 1,
    babyChairs: 0,
    ...newVal
  };
}, { immediate: true, deep: true });

const handleSubmit = () => {
  emit('submit', currentReservation.value);
};

const emit = defineEmits(['closeModal', 'submit']);
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 480px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.modal-title { margin-top: 0; margin-bottom: 25px; text-align: center; font-size: 22px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 500; }
.form-group input, .form-group textarea, .form-group select { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; font-size: 1rem; }
.form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--primary-color); outline: none; box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.1); }

/* [NEW] Spinner Container Styles */
.spinner-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
}

.modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; }
.btn { border: none; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: bold; padding: 12px 22px; }
.btn-primary { background-color: var(--primary-color); color: white; }
.btn-secondary { background-color: #bdc3c7; color: #fff; }
</style>
