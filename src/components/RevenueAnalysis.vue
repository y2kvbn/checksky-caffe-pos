<template>
  <div class="revenue-analysis">
    <h2>營收分析</h2>
    <div class="controls">
      <div class="time-range-selector">
        <button
          :class="{ active: viewMode === '7d' }"
          @click="viewMode = '7d', activePointIndex = null"
        >
          7日
        </button>
        <button
          :class="{ active: viewMode === '30d' }"
          @click="viewMode = '30d', activePointIndex = null"
        >
          30日
        </button>
        <button
          :class="{ active: viewMode === 'topItems' }"
          @click="viewMode = 'topItems'"
        >
          熱賣品項
        </button>
      </div>
    </div>

    <div v-if="viewMode !== 'topItems'" class="chart-container">
        <div 
            class="chart-placeholder"
            @mouseleave="handleMouseLeave"
        >
            <svg ref="svgRef" width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" @mousemove="handleMouseMove">
                <polyline
                    fill="none"
                    stroke="#4eb8d7"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :points="chartPoints"
                />
                <text x="200" y="100" font-family="Arial" font-size="16" text-anchor="middle" fill="#aaa" v-if="!chartPoints">[Chart Placeholder]</text>

                <!-- Tooltip -->
                <g v-if="activePoint" class="tooltip">
                    <line
                        :x1="activePoint.x"
                        y1="0"
                        :x2="activePoint.x"
                        y2="200"
                        stroke="#bbb"
                        stroke-width="1"
                        stroke-dasharray="3"
                    />
                    <circle
                        :cx="activePoint.x"
                        :cy="activePoint.y"
                        r="6"
                        fill="#4eb8d7"
                        stroke="white"
                        stroke-width="2"
                        box-shadow="0 0 10px rgba(78, 184, 215, 0.7)"
                    />
                    <g :transform="`translate(${activePoint.x > 320 ? activePoint.x - 80 : activePoint.x + 20}, ${activePoint.y - 40})`">
                        <rect
                            rx="5"
                            width="70"
                            height="25"
                            fill="rgba(0, 0, 0, 0.7)"
                        />
                        <text
                            x="35"
                            y="17"
                            fill="white"
                            text-anchor="middle"
                            font-size="12"
                            font-weight="bold"
                        >
                            {{ `NT$ ${activePoint.value.toLocaleString()}` }}
                        </text>
                    </g>
                </g>
            </svg>
        </div>
       <div class="stats-container">
        <div class="stat-item">
          <h4>總營收</h4>
          <p>{{ totalRevenue }}</p>
        </div>
        <div class="stat-item">
          <h4>總訂單數</h4>
          <p>{{ totalOrders }}</p>
        </div>
      </div>
    </div>

    <div v-if="viewMode === 'topItems'" class="top-items-container">
      <h3>熱賣品項 Top 5</h3>
      <ul>
        <li v-for="(item, index) in topItems" :key="index">
          <span class="item-rank">{{ index + 1 }}.</span>
          <span class="item-name">{{ item.name }}</span>
          <span class="item-quantity">售出：{{ item.quantity }} 份</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const viewMode = ref('7d'); // '7d', '30d', 'topItems'
const activePointIndex = ref(null);
const svgRef = ref(null);

const revenueData = {
  '7d': {
    revenue: 46246,
    orders: 150,
    chartData: [6423, 7891, 4231, 8888, 9123, 4567, 5123],
  },
  '30d': {
    revenue: 210992,
    orders: 750,
    chartData: [6423, 7891, 4231, 8888, 9123, 4567, 5123, 6789, 7123, 8999, 9876, 5432, 5890, 6321, 7890, 5123, 8345, 9456, 4789, 5321, 6890, 7321, 8765, 9876, 5234, 5789, 6123, 7654, 5012, 8123],
  },
};

const topItems = ref([
  { name: '招牌牛肉麵', quantity: 120 },
  { name: '排骨飯', quantity: 95 },
  { name: '雞腿飯', quantity: 80 },
  { name: '燙青菜', quantity: 75 },
  { name: '珍珠奶茶', quantity: 150 },
]);

const totalRevenue = computed(() => `NT$ ${revenueData[viewMode.value]?.revenue.toLocaleString()}`);
const totalOrders = computed(() => revenueData[viewMode.value]?.orders);

const chartDataPoints = computed(() => {
  const data = revenueData[viewMode.value]?.chartData;
  if (!data) return [];
  
  const width = 380;
  const height = 180;
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const yPadding = 20;

  return data.map((value, index) => {
    const x = 20 + (index / (data.length - 1)) * width;
    const y = yPadding + height - ((value - minVal) / (maxVal - minVal)) * height;
    return { x, y: y-yPadding, value };
  });
});

const chartPoints = computed(() => {
  return chartDataPoints.value.map(p => `${p.x},${p.y}`).join(' ');
});

const activePoint = computed(() => {
    if(activePointIndex.value === null) return null;
    return chartDataPoints.value[activePointIndex.value];
});

const handleMouseMove = (evt) => {
  const svg = svgRef.value;
  if (!svg || !chartDataPoints.value.length) return;

  const rect = svg.getBoundingClientRect();
  const svgWidth = svg.viewBox.baseVal.width;
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
.revenue-analysis {
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 15px;
}

.revenue-analysis h2 {
  font-size: 28px;
  margin-bottom: 25px;
  color: #333;
  font-weight: 600;
}

.controls {
  margin-bottom: 25px;
}

.time-range-selector {
  display: inline-flex;
  border: 1px solid #ddd;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.time-range-selector button {
  padding: 10px 25px;
  border: none;
  background-color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.time-range-selector button:not(:last-child) {
    border-right: 1px solid #ddd;
}

.time-range-selector button.active {
  background-color: #4eb8d7;
  color: white;
  font-weight: 600;
}

.chart-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.08);
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

.stats-container {
    display: flex;
    justify-content: space-around;
    text-align: center;
}

.stat-item h4 {
    font-size: 18px;
    color: #666;
    margin-bottom: 10px;
}

.stat-item p {
    font-size: 24px;
    color: #333;
    font-weight: 600;
}


.top-items-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.08);
}

.top-items-container h3 {
  font-size: 22px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.top-items-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.top-items-container li {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.top-items-container li:last-child {
    border-bottom: none;
}

.top-items-container li:hover {
    background-color: #f5f5f5;
}

.item-rank {
  font-size: 18px;
  font-weight: 600;
  color: #4eb8d7;
  margin-right: 15px;
  width: 30px;
}

.item-name {
  font-size: 18px;
  color: #333;
  flex-grow: 1;
}

.item-quantity {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.tooltip {
    pointer-events: none;
}
</style>