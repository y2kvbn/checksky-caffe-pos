<template>
  <div class="receipt-wrapper">
    <div class="receipt-content">
      <!-- Header -->
      <div class="receipt-header">
        <h2 class="store-name">iCheck Cafe</h2>
        <p>訂單編號: {{ order.id }}</p>
        <p>訂單時間: {{ formattedDate }}</p>
      </div>

      <!-- Items -->
      <div class="receipt-items">
        <table>
          <thead>
            <tr>
              <th>品項</th>
              <th>數量</th>
              <th>單價</th>
              <th>小計</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ item.price.toFixed(2) }}</td>
              <td>${{ (item.quantity * item.price).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary -->
      <div class="receipt-summary">
        <div class="summary-row">
          <span>小計</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        <div v-if="order.discount > 0" class="summary-row discount">
          <span>折扣 ({{ order.discount * 100 }}%)</span>
          <span>-${{ (subtotal * order.discount).toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span>總計</span>
          <span>${{ order.total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Footer Notes -->
      <div class="receipt-footer">
        <p>{{ receiptNotes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSettingsStore } from '../stores/settings';

// Props
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

// Store
const settingsStore = useSettingsStore();
const receiptNotes = computed(() => settingsStore.receiptNotes);

// Computed Properties
const formattedDate = computed(() => {
  return new Date(props.order.timestamp).toLocaleString('zh-TW');
});

const subtotal = computed(() => {
  return props.order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
});

</script>

<style scoped>
.receipt-wrapper {
  font-family: 'monospace', 'Courier New', Courier;
  background-color: #f8f8f8;
  padding: 20px;
  color: #000;
}

.receipt-content {
  width: 300px; /* Typical receipt width */
  margin: 0 auto;
  padding: 15px;
  background: #fff;
  border: 1px solid #ccc;
}

.receipt-header, .receipt-footer {
  text-align: center;
  margin-bottom: 15px;
}

.receipt-header .store-name {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.receipt-header p {
  margin: 2px 0;
  font-size: 12px;
}

.receipt-items table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.receipt-items th, .receipt-items td {
  padding: 5px 0;
  text-align: left;
}

.receipt-items thead tr {
   border-top: 1px dashed #000;
   border-bottom: 1px dashed #000;
}

.receipt-items th:nth-child(2), .receipt-items td:nth-child(2) {
  text-align: center;
}
.receipt-items th:nth-child(3), .receipt-items td:nth-child(3) {
  text-align: right;
}
.receipt-items th:nth-child(4), .receipt-items td:nth-child(4) {
  text-align: right;
}

.receipt-summary {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed #000;
  font-size: 13px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.summary-row.total {
  font-weight: bold;
  font-size: 16px;
  margin-top: 5px;
}

.summary-row.discount {
  color: #d9534f;
}

.receipt-footer {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed #000;
  font-size: 12px;
  white-space: pre-wrap; /* Respect newlines from the settings */
}

/* Print-specific styles */
@media print {
  .receipt-wrapper {
    background-color: #fff;
    padding: 0;
  }
  .receipt-content {
    width: 100%;
    border: none;
    box-shadow: none;
    margin: 0;
    padding: 0;
  }
}
</style>
