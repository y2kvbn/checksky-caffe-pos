
<template>
  <div class="reservation-container">
    <!-- Header: Day Navigation & Actions -->
    <div class="reservation-header">
      <div class="date-navigation">
        <button @click="changeDay(-1)" class="nav-btn"><span>&#8249;</span> 前一天</button>
        <h2 class="current-date">{{ headerDate }}</h2>
        <button @click="changeDay(1)" class="nav-btn">後一天 <span>&#8250;</span></button>
        <button @click="goToToday" class="today-btn">回到今天</button>
      </div>
      <button class="btn btn-primary add-reservation-btn" @click="openAddModal"><span>&#43;</span> 新增訂位</button>
    </div>

    <!-- Main Content: Calendar & Timeline -->
    <div class="reservation-body">
      <aside class="calendar-sidebar">
        <v-calendar
          is-expanded
          :attributes="calendarAttributes"
          v-model="selectedDate"
          @dayclick="onDayClick"
          class="custom-calendar"
        />
      </aside>
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
                    <span v-if="reservation.babyChairs > 0"><span class="meta-icon">&#128118;</span> {{ reservation.babyChairs }} 張嬰兒座椅</span>
                  </div>
                </div>
                <div class="item-actions">
                  <button class="btn-icon" @click="openEditModal(reservation)" title="編輯">&#9998;</button>
                  <button class="btn-icon btn-delete" @click="confirmDelete(reservation.id)" title="刪除">&#128465;</button>
                </div>
              </li>
            </ul>
            <div v-else class="no-reservations">
              <p>本日無訂位紀錄</p>
            </div>
        </div>
      </main>
    </div>

    <!-- Reservation Modal (for Add/Edit) -->
    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">{{ modalMode === 'add' ? '新增' : '編輯' }}訂位</h3>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="name">訂位姓名:</label>
                <input type="text" id="name" v-model="currentReservation.name" required>
            </div>
            <div class="form-group">
                <label for="date">訂位日期:</label>
                <input type="date" id="date" v-model="currentReservation.date" required>
            </div>
            <div class="form-group">
                <label for="time">訂位時間:</label>
                <input type="time" id="time" v-model="currentReservation.time" required>
            </div>
            <div class="form-grid">
              <div class="form-group">
                  <label for="guests">訂位人數:</label>
                  <input type="number" id="guests" v-model.number="currentReservation.guests" min="1" required>
              </div>
              <div class="form-group">
                  <label for="babyChairs">嬰兒座椅:</label>
                  <input type="number" id="babyChairs" v-model.number="currentReservation.babyChairs" min="0">
              </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
                <button type="submit" class="btn btn-primary">{{ modalMode === 'add' ? '儲存' : '更新' }}</button>
            </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useReservationsStore } from '../stores/reservations';
import { storeToRefs } from 'pinia';
import { Calendar } from 'v-calendar';
import 'v-calendar/style.css';

const reservationsStore = useReservationsStore();
const { reservations } = storeToRefs(reservationsStore);
const { addReservation, updateReservation, deleteReservation } = reservationsStore;

const selectedDate = ref(new Date());
const isModalVisible = ref(false);
const modalMode = ref('add');
const defaultReservation = () => ({
  id: null,
  name: '',
  date: new Date(selectedDate.value).toISOString().substring(0, 10),
  time: new Date().toTimeString().substring(0, 5),
  guests: 1,
  babyChairs: 0
});
const currentReservation = ref(defaultReservation());

const headerDate = computed(() => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date(selectedDate.value).toLocaleDateString('zh-TW', options);
});

const sidebarTitle = computed(() => {
    const options = { month: 'long', day: 'numeric' };
    return `${new Date(selectedDate.value).toLocaleDateString('zh-TW', options)} 訂位時間軸`;
});

const reservationsForSelectedDate = computed(() => {
    const dateStr = new Date(selectedDate.value).toISOString().substring(0, 10);
    return reservations.value.filter(r => r.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
});

const calendarAttributes = computed(() => [
  { key: 'today', highlight: { color: 'purple', fillMode: 'light' }, dates: new Date() },
  { key: 'selected', highlight: { color: 'purple', fillMode: 'solid' }, dates: selectedDate.value },
  {
    dot: 'red',
    dates: reservations.value.map(r => {
        const date = new Date(r.date);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date;
    })
  }
]);

const changeDay = (offset) => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + offset);
  selectedDate.value = newDate;
};

const goToToday = () => { selectedDate.value = new Date(); };
const onDayClick = (day) => { selectedDate.value = day.date; };

const openAddModal = () => {
  modalMode.value = 'add';
  currentReservation.value = defaultReservation();
  currentReservation.value.date = new Date(selectedDate.value).toISOString().substring(0, 10);
  isModalVisible.value = true;
};

const openEditModal = (reservation) => {
  modalMode.value = 'edit';
  currentReservation.value = { ...reservation };
  isModalVisible.value = true;
};

const closeModal = () => { isModalVisible.value = false; };

const handleSubmit = () => {
  const payload = { ...currentReservation.value };
  if (modalMode.value === 'add') {
    addReservation(payload);
  } else {
    updateReservation(payload);
  }
  closeModal();
};

const confirmDelete = (reservationId) => {
  if (window.confirm('您確定要刪除此訂位嗎？')) {
    deleteReservation(reservationId);
  }
};
</script>

<style scoped>
:root {
  --primary-color: #8e44ad;
  --secondary-color: #9b59b6;
  --background-color: #f4f7f6;
  --card-background: #ffffff;
  --text-dark: #333;
  --text-light: #777;
  --border-color: #e0e0e0;
  --shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.reservation-container {
  padding: 25px;
  height: 100%;
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
}

.reservation-header {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 25px;
}

.date-navigation {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 15px;
}

.current-date { font-size: 26px; font-weight: 600; color: var(--text-dark); }

.nav-btn, .today-btn {
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex; align-items: center; gap: 5px;
}
.nav-btn:hover, .today-btn:hover { background-color: #f0f0f0; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.today-btn { border-color: var(--primary-color); color: var(--primary-color); font-weight: bold; }

.reservation-body {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 25px;
  flex-grow: 1;
  overflow: hidden;
}

.calendar-sidebar {
    border-right: 1px solid var(--border-color);
    padding-right: 25px;
}

.custom-calendar {
    border: none;
}

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

.timeline-header h3 { margin: 0; font-size: 20px; font-weight: 600; }

.timeline-content { overflow-y: auto; }

.reservation-list { list-style: none; padding: 25px; margin: 0; }

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
.reservation-item:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }

.item-time { font-size: 20px; font-weight: bold; color: var(--primary-color); width: 80px; flex-shrink: 0; }

.item-details { flex-grow: 1; }

.item-name { font-size: 18px; font-weight: 600; color: var(--text-dark); }

.item-meta { display: flex; gap: 20px; color: var(--text-light); font-size: 14px; margin-top: 5px; }

.meta-icon { margin-right: 5px; }

.item-actions { display: flex; gap: 10px; opacity: 0; transition: opacity 0.2s; }
.reservation-item:hover .item-actions { opacity: 1; }

.btn-icon { background: none; border: none; font-size: 18px; cursor: pointer; color: #aaa; padding: 5px; }
.btn-icon:hover { color: #333; }
.btn-icon.btn-delete:hover { color: #e74c3c; }

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

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 480px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.modal-title { margin-top: 0; margin-bottom: 25px; text-align: center; font-size: 22px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 500; }
.form-group input { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; transition: border-color 0.2s; }
.form-group input:focus { border-color: var(--primary-color); outline: none; box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.1); }
.modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; }

/* General Button Styles */
.btn { border: none; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: bold; transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 22px; }
.btn-primary { background-color: var(--primary-color); color: white; }
.btn-primary:hover { background-color: var(--secondary-color); box-shadow: 0 4px 15px rgba(142, 68, 173, 0.3); transform: translateY(-2px); }
.btn-secondary { background-color: #bdc3c7; color: #fff; }
.btn-secondary:hover { opacity: 0.9; }

</style>
