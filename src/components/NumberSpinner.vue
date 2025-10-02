<template>
  <div class="number-spinner">
    <label class="spinner-label">
      <i v-if="icon" :class="icon"></i>
      {{ label }}
    </label>
    <div 
      class="spinner-control"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp" 
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="spinner-window">
        <div class="spinner-reel" :style="reelStyle" ref="reel">
          <div v-for="n in numbers" :key="n" 
               class="spinner-number" 
               :class="{ active: n === modelValue }">
            {{ String(n).padStart(2, '0') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  modelValue: number;
  min: number;
  max: number;
  label: string;
  icon?: string; // [NEW] Optional icon prop
}>();

const emit = defineEmits(['update:modelValue']);

const numbers = computed(() => {
  const nums = [];
  for (let i = props.min; i <= props.max; i++) {
    nums.push(i);
  }
  return nums;
});

const isDragging = ref(false);
const startY = ref(0);
const startValue = ref(0);
const currentY = ref(0);

const numberHeight = 30; // height of a single number element

const reelStyle = computed(() => ({
  transform: `translateY(-${(props.modelValue - props.min) * numberHeight}px)`,
  transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
}));

// Mouse and Touch handlers (no changes needed here)
const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true;
  startY.value = event.clientY;
  startValue.value = props.modelValue;
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return;
  event.preventDefault();
  const deltaY = event.clientY - startY.value;
  const valueChange = -Math.round(deltaY / numberHeight); // Invert direction
  
  let newValue = startValue.value + valueChange;
  newValue = Math.max(props.min, Math.min(props.max, newValue));

  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue);
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

const handleTouchStart = (event: TouchEvent) => {
  isDragging.value = true;
  startY.value = event.touches[0].clientY;
  startValue.value = props.modelValue;
};

const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging.value) return;
  event.preventDefault();
  const deltaY = event.touches[0].clientY - startY.value;
  const valueChange = -Math.round(deltaY / numberHeight); // Invert direction

  let newValue = startValue.value + valueChange;
  const range = props.max - props.min + 1;
  let unboundedValue = (newValue - props.min) % range;
  if (unboundedValue < 0) {
    unboundedValue += range;
  }
  newValue = unboundedValue + props.min;
  
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue);
  }
};

const handleTouchEnd = () => {
  isDragging.value = false;
};
</script>

<style scoped>
/* [NEW] Import Font Awesome */
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';

.number-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  user-select: none;
}

.spinner-label {
  display: flex; /* [NEW] */
  align-items: center; /* [NEW] */
  gap: 8px; /* [NEW] */
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
  font-size: 1rem;
}

.spinner-control {
  background-color: #f7f8fa;
  border-radius: 10px;
  width: 120px;
  height: 90px; 
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ns-resize;
  touch-action: none;
}

.spinner-window {
  height: 30px;
  overflow: hidden;
  width: 100%;
  position: relative;
}

.spinner-window::before {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    top: 0;
    height: 30px;
    background-color: rgba(16, 112, 255, 0.08);
    border-radius: 4px;
    z-index: 0;
}

.spinner-reel {
  position: relative;
  z-index: 1;
}

.spinner-number {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #6b7280;
  font-weight: 500;
  transition: color 0.3s, font-weight 0.3s;
}

.spinner-number.active {
  color: #1070ff;
  font-weight: 700;
}
</style>
