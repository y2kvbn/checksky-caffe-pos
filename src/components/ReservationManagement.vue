<template>
  <div class="reservation-container">
    <ReservationHeader :headerDate="headerDate" @changeDay="changeDay" @goToToday="goToToday" @openAddModal="openAddModal" />
    <div class="reservation-body">
      <CalendarPanel :calendarTitle="calendarTitle" :calendarGrid="calendarGrid" @moveMonth="moveMonth" @selectDay="selectDay" />
      <TimelinePanel :sidebarTitle="sidebarTitle" :reservationsForSelectedDate="reservationsForSelectedDate" @openEditModal="openEditModal" @confirmDelete="confirmDelete" />
    </div>
    <ReservationModal :isModalVisible="isModalVisible" :modalMode="modalMode" :reservationData="currentReservation" @closeModal="closeModal" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useReservationsStore } from '../stores/reservations';
import { useTablesStore } from '../stores/tables';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import ReservationHeader from './ReservationHeader.vue';
import CalendarPanel from './CalendarPanel.vue';
import TimelinePanel from './TimelinePanel.vue';
import ReservationModal from './ReservationModal.vue';

dayjs.locale('zh-tw');
dayjs.extend(localizedFormat);

const reservationsStore = useReservationsStore();
const { reservations } = storeToRefs(reservationsStore);
const { addReservation, updateReservation, deleteReservation } = reservationsStore;

const tablesStore = useTablesStore();
const { tables } = storeToRefs(tablesStore);

const selectedDate = ref(dayjs());
const isModalVisible = ref(false);
const modalMode = ref('add');

const defaultReservation = () => ({
  id: null,
  name: '',
  date: selectedDate.value.format('YYYY-MM-DD'),
  time: dayjs().format('HH:mm'),
  guests: 1,
  babyChairs: 0,
  notes: '',
  tableId: null
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
  const startDay = startOfMonth.day();
  const daysInMonth = startOfMonth.daysInMonth();
  const grid = [];

  for (let i = 0; i < startDay; i++) {
    const day = startOfMonth.subtract(startDay - i, 'day');
    grid.push({ date: day, number: day.date(), isCurrentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const day = startOfMonth.date(i);
    const dateStr = day.format('YYYY-MM-DD');
    const count = dailyGuestCounts.value[dateStr];
    let highlight = null;

    if (count) {
      let color = 'gray';
      if (count >= 1 && count <= 10) color = '#2ecc71';
      else if (count >= 11 && count <= 20) color = '#f1c40f';
      else if (count >= 21) color = '#e74c3c';
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

  const remainingCells = 42 - grid.length;
  for (let i = 1; i <= remainingCells; i++) {
    const day = endOfMonth.add(i, 'day');
    grid.push({ date: day, number: day.date(), isCurrentMonth: false });
  }

  return grid;
});

const changeDay = (offset: number) => {
  selectedDate.value = selectedDate.value.add(offset, 'day');
};

const moveMonth = (offset: number) => {
  selectedDate.value = selectedDate.value.add(offset, 'month');
};

const goToToday = () => {
  selectedDate.value = dayjs();
};

const selectDay = (day: any) => {
  if (!day.date) return;
  selectedDate.value = day.date;
};

const openAddModal = () => {
  modalMode.value = 'add';
  currentReservation.value = defaultReservation();
  currentReservation.value.date = selectedDate.value.format('YYYY-MM-DD');
  isModalVisible.value = true;
};

const openEditModal = (reservation: any) => {
  modalMode.value = 'edit';
  currentReservation.value = { ...reservation };
  isModalVisible.value = true;
};

const closeModal = () => { isModalVisible.value = false; };

const handleSubmit = (payload: any) => {
  if (modalMode.value === 'add') {
    addReservation(payload);
  } else {
    updateReservation(payload);
  }
  closeModal();
};

const confirmDelete = (reservationId: string) => {
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
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.reservation-container {
  padding: 25px;
  height: 100%;
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
}

.reservation-body {
  display: grid;
  grid-template-columns: 3fr 7fr;
  gap: 25px;
  flex-grow: 1;
  overflow: hidden;
}
</style>
