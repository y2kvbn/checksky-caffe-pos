<template>
  <div class="custom-picker" v-click-outside="() => showPicker = false">
    <input type="text" :value="modelValue" @focus="showPicker = true" readonly placeholder="選擇日期">
    <div v-if="showPicker" class="picker-dropdown">
      <div class="header">
        <button @click.prevent="changeMonth(-1)">&#8249;</button>
        <span>{{ displayMonthFormatted }}</span>
        <button @click.prevent="changeMonth(1)">&#8250;</button>
      </div>
      <div class="days-grid">
        <div v-for="dayName in dayNames" :key="dayName" class="day-cell header-cell">{{ dayName }}</div>
        <div v-for="day in calendarGrid" :key="day.date.toString()" 
             :class="['day-cell', { 'not-current-month': !day.isCurrentMonth, 'selected': day.isSelected }]" 
             @click="selectDate(day)">
          {{ day.number }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(['update:modelValue']);

const showPicker = ref(false);
const displayMonth = ref(props.modelValue ? dayjs(props.modelValue) : dayjs());

const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

const displayMonthFormatted = computed(() => displayMonth.value.format('YYYY年 MMMM'));

const calendarGrid = computed(() => {
  const startOfMonth = displayMonth.value.startOf('month');
  const endOfMonth = displayMonth.value.endOf('month');
  const startDay = startOfMonth.day(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = startOfMonth.daysInMonth();
  const grid = [];

  // Days from previous month
  for (let i = startDay; i > 0; i--) {
    const day = startOfMonth.subtract(i, 'day');
    grid.push({ date: day, number: day.date(), isCurrentMonth: false });
  }

  // Days in current month
  for (let i = 1; i <= daysInMonth; i++) {
    const day = startOfMonth.date(i);
    grid.push({
      date: day,
      number: i,
      isCurrentMonth: true,
      isSelected: day.isSame(props.modelValue, 'day'),
    });
  }

  // Days from next month
  const remainingCells = 42 - grid.length;
  for (let i = 1; i <= remainingCells; i++) {
    const day = endOfMonth.add(i, 'day');
    grid.push({ date: day, number: day.date(), isCurrentMonth: false });
  }

  return grid;
});

function changeMonth(offset: number) {
  displayMonth.value = displayMonth.value.add(offset, 'month');
}

function selectDate(day: any) {
  if (!day.isCurrentMonth) {
     displayMonth.value = day.date;
     return;
  }
  const newDate = day.date.format('YYYY-MM-DD');
  emit('update:modelValue', newDate);
  showPicker.value = false;
}

const vClickOutside = {
  mounted: (el, binding) => {
    el.clickOutsideEvent = event => {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted: el => {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
};

</script>

<style scoped>
.custom-picker { position: relative; }
input[type="text"] { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; font-size: 1rem; cursor: pointer; }
.picker-dropdown { position: absolute; top: calc(100% + 5px); left: 0; background: white; border-radius: 8px; box-shadow: 0 6px 15px rgba(0,0,0,0.15); z-index: 1001; padding: 15px; width: 300px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.header span { font-weight: bold; font-size: 1.1rem; }
.header button { background: none; border: none; font-size: 1.5rem; cursor: pointer; padding: 0 10px; color: var(--primary-color); }
.days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.day-cell { text-align: center; padding: 8px 0; border-radius: 50%; cursor: pointer; transition: background-color 0.2s; }
.day-cell.header-cell { font-weight: bold; font-size: 0.9rem; cursor: default; }
.day-cell:not(.header-cell):hover { background-color: #f0f0f0; }
.not-current-month { color: #aaa; }
.selected { background-color: var(--primary-color); color: white; }
</style>
