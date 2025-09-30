<template>
  <div class="calendar-column">
    <div class="calendar-header">
      <button @click="emit('moveMonth', -1)">&#8249;</button>
      <h3>{{ calendarTitle }}</h3>
      <button @click="emit('moveMonth', 1)">&#8250;</button>
    </div>
    <div class="custom-calendar">
      <div class="calendar-weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>
      <div class="calendar-grid">
        <div v-for="(day, index) in calendarGrid" :key="index" class="calendar-day" :class="{
          'is-today': day.isToday,
          'is-selected': day.isSelected,
          'not-current-month': !day.isCurrentMonth
        }" @click="emit('selectDay', day)">
          <span class="day-number">{{ day.number }}</span>
          <div v-if="day.highlight" class="day-highlight" :style="{ backgroundColor: day.highlight.color, opacity: 0.2 }"></div>
          <div v-if="day.highlight" class="day-popover">{{ day.highlight.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';

defineProps<{ calendarTitle: string; calendarGrid: any[] }>();
const emit = defineEmits(['moveMonth', 'selectDay']);

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

</script>

<style scoped>
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

.calendar-day:hover {
  background-color: #f0f0f0;
}

.day-number {
  z-index: 1;
}

.not-current-month .day-number {
  color: #ccc;
}

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

.is-selected .day-number {
  color: white;
  border-color: transparent !important;
}

.day-highlight {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
</style>
