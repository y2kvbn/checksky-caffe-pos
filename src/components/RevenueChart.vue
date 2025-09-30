<template>
  <div class="chart-container">
    <div class="chart-placeholder" @mouseleave="handleMouseLeave">
      <svg ref="svgRef" width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" @mousemove="handleMouseMove">
        <polyline fill="none" stroke="#4eb8d7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" :points="chartPoints" />
        <text x="200" y="100" font-family="Arial" font-size="16" text-anchor="middle" fill="#aaa" v-if="!chartPoints">[Chart Placeholder]</text>
        <g v-if="activePoint" class="tooltip">
          <line :x1="activePoint.x" y1="0" :x2="activePoint.x" y2="200" stroke="#bbb" stroke-width="1" stroke-dasharray="3" />
          <circle :cx="activePoint.x" :cy="activePoint.y" r="6" fill="#4eb8d7" stroke="white" stroke-width="2" box-shadow="0 0 10px rgba(78, 184, 215, 0.7)" />
          <g :transform="`translate(${activePoint.x > 320 ? activePoint.x - 80 : activePoint.x + 20}, ${activePoint.y - 40})`">
            <rect rx="5" width="70" height="25" fill="rgba(0, 0, 0, 0.7)" />
            <text x="35" y="17" fill="white" text-anchor="middle" font-size="12" font-weight="bold">{{ `NT$ ${activePoint.value.toLocaleString()}` }}</text>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{ chartData: number[] }>();

const activePointIndex = ref<number | null>(null);
const svgRef = ref<SVGElement | null>(null);

const chartDataPoints = computed(() => {
  const data = props.chartData;
  if (!data) return [];

  const width = 380;
  const height = 180;
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const yPadding = 20;

  return data.map((value, index) => {
    const x = 20 + (index / (data.length - 1)) * width;
    const y = yPadding + height - ((value - minVal) / (maxVal - minVal)) * height;
    return { x, y: y - yPadding, value };
  });
});

const chartPoints = computed(() => {
  return chartDataPoints.value.map(p => `${p.x},${p.y}`).join(' ');
});

const activePoint = computed(() => {
  if (activePointIndex.value === null) return null;
  return chartDataPoints.value[activePointIndex.value];
});

const handleMouseMove = (evt: MouseEvent) => {
  const svg = svgRef.value;
  if (!svg || !chartDataPoints.value.length) return;

  const rect = svg.getBoundingClientRect();
  const svgWidth = (svg as any).viewBox.baseVal.width;
  const clientWidth = rect.width;

  const mouseX = (evt.clientX - rect.left) * (svgWidth / clientWidth);

  let closestIndex = 0;
  let minDistance = Infinity;

  chartDataPoints.value.forEach((point, index) => {
    const distance = Math.abs(point.x - mouseX);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  activePointIndex.value = closestIndex;
};

const handleMouseLeave = () => {
  activePointIndex.value = null;
};
</script>

<style scoped>
.chart-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  height: 450px;
}

.chart-placeholder {
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  position: relative;
  cursor: crosshair;
}

.tooltip {
  pointer-events: none;
}
</style>
