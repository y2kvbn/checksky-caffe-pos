<template>
  <div class="receipt-A4-size">
    <div class="receipt-container">
      <!-- 店家資訊 -->
      <header class="receipt-header">
        <h1>向天湖咖啡民宿</h1>
        <h2>預結帳單</h2>
        <p>日期: {{ formatDateTime(order.timestamp) }}</p>
        <p>單號: {{ order.id.slice(-15) }}</p>
        <p>桌號: {{ order.tableNumber || '未指定' }}</p>
      </header>

      <!-- 商品列表 -->
      <section class="items-section">
        <div class="items-grid header">
          <span class="item-name">商品</span>
          <span>數量</span>
          <span>單價</span>
          <span>金額</span>
        </div>
        <div v-for="item in order.items" :key="item.id" class="items-grid-row">
          <span class="item-name">{{ item.name }}</span>
          <span>{{ item.quantity }}</span>
          <span>{{ item.price }}</span>
          <span>{{ item.price * item.quantity }}</span>
        </div>
      </section>

      <!-- 金額總計 -->
      <section class="summary-section">
        <div class="summary-row">
          <span class="label">金額:</span>
          <span class="value">{{ order.subtotal.toFixed(0) }}</span>
        </div>
        
        <!-- 折扣明細 -->
        <div v-if="order.discount > 0" class="discounts-detail">
            <div v-for="(promo, index) in order.appliedPromotions" :key="index" class="summary-row discount">
                <span class="label">折扣 ({{ promo.name }}):</span>
                <span class="value">-{{ promo.amount.toFixed(0) }}</span>
            </div>
        </div>
        
        <div class="summary-row total">
          <span class="label">實收:</span>
          <span class="value">{{ order.total.toFixed(0) }}</span>
        </div>
      </section>

      <!-- 頁尾 -->
      <footer class="receipt-footer">
        <p>此單據內容僅供參考, 不作為交易憑據</p>
        <p>謝謝光臨</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '../stores/orders';

const props = defineProps<{ 
  order: Order 
}>();

const formatDateTime = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};
</script>

<style scoped>
/* 模擬 58mm 熱感印紙寬度 */
.receipt-A4-size {
  background-color: #f0f2f5; /* 預覽時的背景色 */
  padding: 20px;
  display: flex;
  justify-content: center;
}

.receipt-container {
  width: 320px; /* 模擬寬度 */
  background-color: #fff;
  padding: 25px 20px;
  font-family: 'Courier New', Courier, monospace;
  color: #000;
  border: 1px solid #ddd;
}

.receipt-header {
  text-align: center;
  border-bottom: 1px dashed #000;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.receipt-header h1 {
  font-size: 24px;
  margin: 0;
  font-weight: bold;
}

.receipt-header h2 {
  font-size: 20px;
  margin: 10px 0;
}

.receipt-header p {
  margin: 2px 0;
  font-size: 14px;
}

.items-section .items-grid.header {
  font-weight: bold;
  border-top: 1px dashed #000;
  border-bottom: 1px dashed #000;
  padding: 8px 0;
  margin-bottom: 8px;
}

.items-grid, .items-grid-row {
  display: grid;
  grid-template-columns: 4fr 1fr 2fr 2fr;
  gap: 10px;
  font-size: 14px;
  padding: 4px 0;
}

.items-grid span:not(.item-name), 
.items-grid-row span:not(.item-name) {
  text-align: right;
}

.summary-section {
  border-top: 1px dashed #000;
  padding-top: 15px;
  margin-top: 15px;
  font-size: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-row .label {
  font-weight: bold;
}

.summary-row .value {
  min-width: 80px;
  text-align: right;
}

.summary-row.discount .label,
.summary-row.discount .value {
    font-size: 14px;
    color: #333;
}

.summary-row.total {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
}

.receipt-footer {
  text-align: center;
  border-top: 1px dashed #000;
  padding-top: 15px;
  margin-top: 15px;
  font-size: 14px;
}

.receipt-footer p {
  margin: 0;
}

/* 列印時的樣式 */
@media print {
  .receipt-A4-size {
    background-color: white;
    padding: 0;
  }
  .receipt-container {
    width: 100%;
    border: none;
    box-shadow: none;
  }
}
</style>