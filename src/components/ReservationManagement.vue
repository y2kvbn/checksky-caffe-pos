
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
      <div class="calendar-column">
        <div class="calendar-header">
          <button @click="moveMonth(-1)">&#8249;</button>
          <h3>{{ calendarTitle }}</h3>
          <button @click="moveMonth(1)">&#8250;</button>
        </div>
        <!-- Custom Calendar -->
        <div class="custom-calendar">
          <div class="calendar-weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
          </div>
          <div class="calendar-grid">
            <div
              v-for="(day, index) in calendarGrid"
              :key="index"
              class="calendar-day"
              :class="{
                'is-today': day.isToday,
                'is-selected': day.isSelected,
                'not-current-month': !day.isCurrentMonth
              }"
              @click="selectDay(day)"
            >
              <span class="day-number">{{ day.number }}</span>
               <div v-if="day.highlight" class="day-highlight" :style="{ backgroundColor: day.highlight.color, opacity: 0.2 }"></div>
               <div v-if="day.highlight" class="day-popover">{{ day.highlight.label }}</div>
            </div>
          </div>
        </div>
      </div>
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
                  <p v-if="reservation.notes" class="item-notes"><b>備註:</b> {{ reservation.notes }}</p>
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
            <div class="form-group">
                <label for="notes">備註:</label>
                <textarea id="notes" v-model="currentReservation.notes" rows="3"></textarea>
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
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.locale('zh-tw');
dayjs.extend(localizedFormat);

const reservationsStore = useReservationsStore();
const { reservations } = storeToRefs(reservationsStore);
const { addReservation, updateReservation, deleteReservation } = reservationsStore;

const selectedDate = ref(dayjs('2025-09-01'));
const isModalVisible = ref(false);
const modalMode = ref('add');

const defaultReservation = () => ({
  id: null,
  name: '',
  date: selectedDate.value.format('YYYY-MM-DD'),
  time: dayjs().format('HH:mm'),
  guests: 1,
  babyChairs: 0,
  notes: ''
});

const currentReservation = ref(defaultReservation());

const headerDate = computed(() => {
    return selectedDate.value.format('YYYY年 MMMM D日 dddd');
});

const sidebarTitle = computed(() => {
    return `${selectedDate.value.format('MMMM D日')} 訂位時間軸`;
});

const calendarTitle = computed(() => {
  return selectedDate.value.format('YYYY年 MMMM');
});

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

const dailyGuestCounts = computed(() => {
    const counts = {};
    for (const r of reservations.value) {
        const date = r.date;
        counts[date] = (counts[date] || 0) + r.guests;
    }
    return counts;
});

const calendarGrid = computed(() => {
  const startOfMonth = selectedDate.value.startOf('month');
  const endOfMonth = selectedDate.value.endOf('month');
  const startDay = startOfMonth.day(); // 0 for Sunday, 1 for Monday, etc.
  const daysInMonth = startOfMonth.daysInMonth();

  const grid = [];

  // Add days from previous month
  for (let i = 0; i < startDay; i++) {
    const day = startOfMonth.subtract(startDay - i, 'day');
    grid.push({ date: day, number: day.date(), isCurrentMonth: false });
  }

  // Add days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    const day = startOfMonth.date(i);
    const dateStr = day.format('YYYY-MM-DD');
    const count = dailyGuestCounts.value[dateStr];
    let highlight = null;

    if (count) {
        let color = 'gray';
        if (count >= 1 && count <= 10) color = '#2ecc71'; // green
        else if (count >= 11 && count <= 20) color = '#f1c40f'; // yellow
        else if (count >= 21) color = '#e74c3c'; // red
        highlight = { color, label: `${count} 位訂位` };
    }

    grid.push({
      date: day,
      number: i,
      isCurrentMonth: true,
      isToday: day.isSame(dayjs(), 'day'),
      isSelected: day.isSame(selectedDate.value, 'day'),
      highlight
    });
  }

  // Add days from next month
  const remainingCells = 42 - grid.length; // 6 weeks * 7 days
  for (let i = 1; i <= remainingCells; i++) {
    const day = endOfMonth.add(i, 'day');
    grid.push({ date: day, number: day.date(), isCurrentMonth: false });
  }

  return grid;
});


const changeDay = (offset) => {
  selectedDate.value = selectedDate.value.add(offset, 'day');
};

const moveMonth = (offset) => {
  selectedDate.value = selectedDate.value.add(offset, 'month');
};

const goToToday = () => { 
    selectedDate.value = dayjs();
};

const selectDay = (day) => {
    if (!day.date) return;
    selectedDate.value = day.date;
}

const openAddModal = () => {
  modalMode.value = 'add';
  currentReservation.value = defaultReservation();
  currentReservation.value.date = selectedDate.value.format('YYYY-MM-DD');
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

const reservationsForSelectedDate = computed(() => {
    const dateStr = selectedDate.value.format('YYYY-MM-DD');
    return reservations.value.filter(r => r.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
});

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
  grid-template-columns: 3fr 7fr; /* 30% / 70% split */
  gap: 25px;
  flex-grow: 1;
  overflow: hidden;
}

.calendar-column {
    display: flex;
    flex-direction: column;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding: 0 10px; 
}

.calendar-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    flex-grow: 1;
    text-align: center;
}

.calendar-header button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
}

.calendar-header button:hover {
    color: #333;
}

/* Custom Calendar Styles */
.custom-calendar {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: var(--card-background);
  border-radius: 12px;
  padding: 15px;
  box-shadow: var(--shadow);
}
.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  color: var(--text-light);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  flex-grow: 1;
  gap: 5px;
}
.calendar-day {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}
.calendar-day:hover { background-color: #f0f0f0; }
.day-number { z-index: 1; }
.not-current-month .day-number { color: #ccc; }
.is-today .day-number { 
  font-weight: bold;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  width: 2.2em;
  height: 2.2em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.is-selected {
  background-color: var(--primary-color) !important;
  color: white;
}
.is-selected .day-number { color: white; border-color: transparent !important; }
.day-highlight {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 8px;
  z-index: 0;
}
.calendar-day:hover .day-popover {
  display: block;
}
.day-popover {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-5px);
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
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

.item-notes {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
  background-color: #f9f9f9;
  border-left: 3px solid var(--primary-color);
  padding: 8px 12px;
}

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
.form-group input, .form-group textarea { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; transition: border-color 0.2s; }
.form-group input:focus, .form-group textarea:focus { border-color: var(--primary-color); outline: none; box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.1); }
.modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; }

/* General Button Styles */
.btn { border: none; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: bold; transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 22px; }
.btn-primary { background-color: var(--primary-color); color: white; }
.btn-primary:hover { background-color: var(--secondary-color); box-shadow: 0 4px 15px rgba(142, 68, 173, 0.3); transform: translateY(-2px); }
.btn-secondary { background-color: #bdc3c7; color: #fff; }
.btn-secondary:hover { opacity: 0.9; }

</style>
