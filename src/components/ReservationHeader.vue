<template>
  <div class="reservation-header">
    <div class="date-navigation">
      <button @click="$emit('changeDay', -1)" class="nav-btn"><span>&#8249;</span> 前一天</button>
      <h2 class="current-date">{{ headerDate }}</h2>
      <button @click="$emit('changeDay', 1)" class="nav-btn">後一天 <span>&#8250;</span></button>
      <button @click="$emit('goToToday')" class="today-btn">回到今天</button>
    </div>
    <button class="btn btn-primary add-reservation-btn" @click="$emit('openAddModal')"><span>&#43;</span> 新增訂位</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ headerDate: string }>();

defineEmits<{
  (e: 'changeDay', offset: number): void;
  (e: 'goToToday'): void;
  (e: 'openAddModal'): void;
}>();
</script>

<style scoped>
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

.current-date {
  font-size: 26px;
  font-weight: 600;
  color: var(--text-dark);
}

.nav-btn,
.today-btn {
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.nav-btn:hover,
.today-btn:hover {
  background-color: #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.today-btn {
  border-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: bold;
}

.btn {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 22px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--secondary-color);
  box-shadow: 0 4px 15px rgba(142, 68, 173, 0.3);
  transform: translateY(-2px);
}
</style>
