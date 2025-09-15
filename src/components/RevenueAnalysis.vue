<template>
  <div class="revenue-analysis">
    <h2>營收分析</h2>
    <div class="controls">
        <div class="time-range-selector">
            <button 
                :class="{ active: selectedRange === '7d' }" 
                @click="selectedRange = '7d'"
            >
                7日
            </button>
            <button 
                :class="{ active: selectedRange === '30d' }" 
                @click="selectedRange = '30d'"
            >
                30日
            </button>
        </div>
    </div>
    <div class="chart-container">
        <div class="chart-placeholder">
            <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
              <path d="M 20 180 L 80 120 L 140 150 L 200 80 L 260 110 L 320 50 L 380 90" fill="none" stroke="#4eb8d7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
               <text x="200" y="100" font-family="Arial" font-size="16" text-anchor="middle" fill="#aaa">[Chart Placeholder]</text>
            </svg>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedRange = ref('7d');
</script>

<style scoped>
.revenue-analysis {
    padding: 25px;
}

.revenue-analysis h2 {
    font-size: 28px;
    margin-bottom: 25px;
    color: #333;
}

.controls {
    margin-bottom: 25px;
}

.time-range-selector {
    display: inline-flex;
    border: 1px solid #ddd;
    border-radius: 20px;
    overflow: hidden;
}

.time-range-selector button {
    padding: 10px 25px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.time-range-selector button.active {
    background-color: #4eb8d7;
    color: white;
}

.chart-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.08);
    height: 400px; /* Adjust height as needed */
}

.chart-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>
