<template>
  <div class="system-settings">
    <h2>系統設定</h2>

    <!-- 優惠活動設定 -->
    <div class="settings-card promo-card">
      <h3><i class="fas fa-tags"></i> 優惠活動設定</h3>
      <p>調整點餐系統中的即時優惠。儲存後將立即對新的訂單生效。</p>

      <!-- 分隔線 -->
      <hr class="divider">

      <!-- 滿額折扣 -->
      <div class="promo-group">
          <div class="promo-header">
              <h4>滿額折扣</h4>
              <div class="switch-container">
                  <label class="switch">
                      <input type="checkbox" v-model="localSpendAndDiscount.enabled">
                      <span class="slider-switch round"></span>
                  </label>
                  <span :class="{'text-enabled': localSpendAndDiscount.enabled, 'text-disabled': !localSpendAndDiscount.enabled}">
                      {{ localSpendAndDiscount.enabled ? '已啟用' : '已停用' }}
                  </span>
              </div>
          </div>
          <div class="promo-details" :class="{ 'details-disabled': !localSpendAndDiscount.enabled }">
              <div class="promo-setting-item">
                  <label for="discount-threshold">消費門檻</label>
                  <div class="input-group">
                      <span>滿</span>
                      <input type="number" id="discount-threshold" v-model.number="localSpendAndDiscount.threshold" :disabled="!localSpendAndDiscount.enabled" placeholder="例如：1000">
                      <span>元</span>
                  </div>
              </div>
              <div class="promo-setting-item">
                  <label for="discount-value">折扣</label>
                  <div class="input-group">
                      <span>打</span>
                      <input type="number" id="discount-value" v-model.number="localSpendAndDiscount.discount" :disabled="!localSpendAndDiscount.enabled" placeholder="例如：85">
                      <span>折</span>
                  </div>
              </div>
          </div>
      </div>

      <!-- 分隔線 -->
      <hr class="divider">

      <!-- 滿額贈 -->
       <div class="promo-group">
          <div class="promo-header">
              <h4>滿額贈品</h4>
               <div class="switch-container">
                  <label class="switch">
                      <input type="checkbox" v-model="localSpendAndGet.enabled">
                      <span class="slider-switch round"></span>
                  </label>
                  <span :class="{'text-enabled': localSpendAndGet.enabled, 'text-disabled': !localSpendAndGet.enabled}">
                      {{ localSpendAndGet.enabled ? '已啟用' : '已停用' }}
                  </span>
              </div>
          </div>
          <div class="promo-details" :class="{ 'details-disabled': !localSpendAndGet.enabled }">
              <div class="promo-setting-item">
                  <label for="gift-threshold">消費門檻</label>
                  <div class="input-group">
                      <span>滿</span>
                      <input type="number" id="gift-threshold" v-model.number="localSpendAndGet.threshold" :disabled="!localSpendAndGet.enabled" placeholder="例如：500">
                      <span>元</span>
                  </div>
              </div>
              <div class="promo-setting-item">
                  <label for="gift-item-name">贈品名稱</label>
                  <div class="input-group">
                      <span>送</span>
                      <input type="text" id="gift-item-name" v-model="localSpendAndGet.giftName" :disabled="!localSpendAndGet.enabled" placeholder="例如：炸物拼盤">
                  </div>
              </div>
          </div>
      </div>

      <button class="btn btn-primary" @click="savePromotions">儲存優惠設定</button>
      <p v-if="showPromoSuccessMessage" class="success-message">優惠設定已更新！</p>
    </div>

    <!-- 收據備註文字 -->
    <div class="settings-card">
        <h3><i class="fas fa-receipt"></i> 收據備註文字</h3>
        <p>顯示於訂單收據最下方的文字欄位。</p>
        <textarea v-model="localReceiptNotes" rows="4" placeholder="例如：感謝您的光臨，歡迎再次惠顧！"></textarea>
        <button class="btn btn-primary" @click="saveReceiptNotes">儲存備註</button>
        <p v-if="showNotesSuccessMessage" class="success-message">備註已更新！</p>
    </div>

    <!-- 登入管理 -->
     <div class="settings-card">
      <h3><i class="fas fa-history"></i> 登入管理</h3>
      <p>查詢最近的登入活動紀錄。</p>
      <div class="login-history">
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>使用者</th>
              <th>IP位址</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024-07-28 10:30</td>
              <td>Checksky</td>
              <td>192.168.1.1</td>
              <td class="status-success">成功</td>
            </tr>
            <tr>
              <td>2024-07-27 18:45</td>
              <td>Checksky</td>
              <td>192.168.1.1</td>
              <td class="status-success">成功</td>
            </tr>
             <tr>
              <td>2024-07-27 09:12</td>
              <td>admin</td>
              <td>10.0.0.5</td>
              <td class="status-fail">失敗</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 關於 -->
    <div class="settings-card">
        <h3><i class="fas fa-info-circle"></i> 關於</h3>
        <div class="about-section">
            <div class="about-item">
                <strong>程式版本:</strong>
                <span>1.0.0</span>
            </div>
             <div class="about-item">
                <strong>客服聯繫方式:</strong>
                <span>永泓股份有限公司 (service@checksky.com.tw)</span>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { usePromotionsStore } from '../stores/promotions';
import { useSettingsStore } from '../stores/settings';

// Stores
const promotionsStore = usePromotionsStore();
const settingsStore = useSettingsStore();

// Local reactive state for Promotions
const localSpendAndDiscount = reactive({ enabled: false, threshold: 1000, discount: 85 });
const localSpendAndGet = reactive({ enabled: false, threshold: 500, giftName: '' });
const showPromoSuccessMessage = ref(false);

// Local state for Receipt Notes
const localReceiptNotes = ref('');
const showNotesSuccessMessage = ref(false);

// Sync local state with stores on component mount
onMounted(() => {
  // Deep copy from store to local state to avoid direct mutation
  Object.assign(localSpendAndDiscount, JSON.parse(JSON.stringify(promotionsStore.spendAndDiscount)));
  Object.assign(localSpendAndGet, JSON.parse(JSON.stringify(promotionsStore.spendAndGet)));
  
  // Sync Receipt Notes
  localReceiptNotes.value = settingsStore.receiptNotes;
});

const savePromotions = () => {
  // Call store actions with the full local state object
  promotionsStore.updateSpendAndDiscount(JSON.parse(JSON.stringify(localSpendAndDiscount)));
  promotionsStore.updateSpendAndGet(JSON.parse(JSON.stringify(localSpendAndGet)));

  showPromoSuccessMessage.value = true;
  setTimeout(() => {
      showPromoSuccessMessage.value = false;
  }, 2000);
};

const saveReceiptNotes = () => {
  settingsStore.updateReceiptNotes(localReceiptNotes.value);
  showNotesSuccessMessage.value = true;
  setTimeout(() => {
    showNotesSuccessMessage.value = false;
  }, 2000);
};

</script>

<style scoped>

.system-settings h2 {
  font-size: 28px;
  margin-bottom: 25px;
  color: #333;
}

.settings-card {
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.08);
    padding: 25px;
    margin-bottom: 25px;
}

.promo-card {
    border-left: 5px solid #ff6b6b;
}

.settings-card h3 {
    font-size: 20px;
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #333;
}

.settings-card p {
    margin: 0 0 20px 0;
    color: #666;
    line-height: 1.5;
}

.divider {
    border: none;
    border-top: 1px solid #eee;
    margin: 30px 0;
}

/* Promo specific styles */
.promo-group {
    margin-bottom: 15px;
}

.promo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.promo-header h4 {
    font-size: 18px;
    margin: 0;
    color: #444;
}

.promo-details {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.promo-details.details-disabled {
    opacity: 0.5;
    pointer-events: none; /* Prevents interaction */
}

.promo-setting-item {
    margin-bottom: 20px;
}

.promo-setting-item label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
    font-size: 15px;
}

.input-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.input-group span {
    font-weight: 500;
    font-size: 16px;
}

.input-group input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    text-align: center;
    max-width: 150px;
}

.btn-primary {
  background-color: #ff6b6b;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-top: 20px; /* Added for spacing */
}

.btn-primary:hover {
    opacity: 0.9;
    transform: scale(1.02);
}

.success-message {
    color: #28a745;
    font-weight: bold;
    margin-top: 15px;
}

/* Switch toggle styles */
.switch-container {
    display: flex;
    align-items: center;
    gap: 10px;
}
.text-enabled { color: #28a745; font-weight: bold; }
.text-disabled { color: #aaa; }

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider-switch {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider-switch:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider-switch {
  background-color: #ff6b6b;
}

input:focus + .slider-switch {
  box-shadow: 0 0 1px #ff6b6b;
}

input:checked + .slider-switch:before {
  transform: translateX(22px);
}

.slider-switch.round {
  border-radius: 34px;
}

.slider-switch.round:before {
  border-radius: 50%;
}


/* Other styles */
.login-history table {
    width: 100%;
    border-collapse: collapse;
}

.login-history th, .login-history td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
}

.login-history th {
    background-color: #f9f9f9;
    font-weight: 600;
}

.status-success {
    color: #28a745;
    font-weight: bold;
}

.status-fail {
    color: #dc3545;
    font-weight: bold;
}

textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    resize: vertical;
    line-height: 1.6;
}

.about-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.about-item {
    display: flex;
    gap: 10px;
}

.about-item strong {
    color: #333;
}
</style>
