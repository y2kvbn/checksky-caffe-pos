<template>
  <div class="custom-picker" v-click-outside="() => showPicker = false">
    <input type="text" :value="modelValue" @focus="showPicker = true" readonly placeholder="選擇時間">
    <div v-if="showPicker" class="picker-dropdown time-picker-dropdown">
      <div class="time-selectors">
        <div class="selector">
          <label>小時</label>
          <div class="options-list">
            <div v-for="h in hours" :key="h" 
                 :class="{'option': true, 'selected': h === selectedHour}" 
                 @click="selectHour(h)">
              {{ h }}
            </div>
          </div>
        </div>
        <div class="selector">
          <label>分鐘</label>
          <div class="options-list">
            <div v-for="m in minutes" :key="m" 
                 :class="{'option': true, 'selected': m === selectedMinute}" 
                 @click="selectMinute(m)">
              {{ m }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(['update:modelValue']);

const showPicker = ref(false);

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];

const selectedHour = computed(() => props.modelValue.split(':')[0] || '12');
const selectedMinute = computed(() => props.modelValue.split(':')[1] || '00');

function selectHour(hour: string) {
  const newTime = `${hour}:${selectedMinute.value}`;
  emit('update:modelValue', newTime);
}

function selectMinute(minute: string) {
  const newTime = `${selectedHour.value}:${minute}`;
  emit('update:modelValue', newTime);
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
.picker-dropdown { position: absolute; top: calc(100% + 5px); left: 0; background: white; border-radius: 8px; box-shadow: 0 6px 15px rgba(0,0,0,0.15); z-index: 1001; padding: 15px; }
.time-picker-dropdown { width: 220px; }
.time-selectors { display: flex; gap: 10px; }
.selector { flex: 1; }
.selector label { text-align: center; display: block; font-weight: bold; margin-bottom: 10px; }
.options-list { height: 180px; overflow-y: auto; border: 1px solid #eee; border-radius: 6px; }
.option { padding: 8px; text-align: center; cursor: pointer; transition: background-color 0.2s; }
.option:hover { background-color: #f0f0f0; }
.option.selected { background-color: var(--primary-color); color: white; }

/* Custom scrollbar for webkit browsers */
.options-list::-webkit-scrollbar { width: 6px; }
.options-list::-webkit-scrollbar-track { background: #f1f1f1; }
.options-list::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
.options-list::-webkit-scrollbar-thumb:hover { background: #aaa; }
</style>
