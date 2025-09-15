<template>
  <div class="system-settings">
    <h2>系統設定</h2>

    <!-- 優惠活動設定 -->
    <div class="settings-card promo-card">
      <h3><i class="fas fa-tags"></i> 優惠活動設定</h3>
      <p>調整點餐系統中的即時優惠，設定會立即生效。</p>
      
      <div class="promo-setting-item">
        <label :for="'discount-slider'">全單折扣 ({{ 100 - localDiscount }} 折)</label>
        <div class="slider-container">
          <input 
            type="range" 
            id="discount-slider" 
            min="0" 
            max="50" 
            v-model.number="localDiscount"
            class="slider"
          />
          <span class="slider-value">{{ localDiscount }}% OFF</span>
        </div>
      </div>

      <div class="promo-setting-item">
        <label for="gift-threshold">滿額贈品項門檻</label>
        <div class="input-group">
            <span>滿</span>
            <input type="number" id="gift-threshold" v-model.number="localGiftThreshold" placeholder="例如：500">
            <span>元</span>
        </div>
      </div>

      <div class="promo-setting-item">
        <label for="gift-item-name">贈品名稱</label>
        <div class="input-group">
            <span>送</span>
            <input type="text" id="gift-item-name" v-model="localGiftItemName" placeholder="例如：炸物拼盤">
        </div>
      </div>

      <button class="btn btn-primary" @click="savePromotions">儲存設定</button>
      <p v-if="showSuccessMessage" class="success-message">優惠設定已更新！</p>
    </div>

    <!-- 其他卡片... -->
     <div class="settings-card">
      <h3>登入管理</h3>
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

    <div class="settings-card">
        <h3>收據備註文字</h3>
        <p>顯示於訂單收據最下方的文字欄位。</p>
        <textarea v-model="receiptNotes" rows="3"></textarea>
    </div>

    <div class="settings-card">
        <h3>關於</h3>
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
import { ref, onMounted } from 'vue';
import { usePromotionsStore } from '../stores/promotions';
import { storeToRefs } from 'pinia';

const promotionsStore = usePromotionsStore();
const { discountPercentage, giftThreshold, giftItemName } = storeToRefs(promotionsStore);

// Local state for inputs, to be synced with the store
const localDiscount = ref(0);
const localGiftThreshold = ref(0);
const localGiftItemName = ref('');
const showSuccessMessage = ref(false);

// Sync local state with store on component mount
onMounted(() => {
  localDiscount.value = discountPercentage.value;
  localGiftThreshold.value = giftThreshold.value;
  localGiftItemName.value = giftItemName.value;
});

const savePromotions = () => {
  promotionsStore.updatePromotions({
    discountPercentage: localDiscount.value,
    giftThreshold: localGiftThreshold.value,
    giftItemName: localGiftItemName.value,
  });
  showSuccessMessage.value = true;
  setTimeout(() => {
      showSuccessMessage.value = false;
  }, 2000);
};

const receiptNotes = ref('沒有一來就有好吃的啦！請耐心等候^＿^ ');

</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

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
}

.settings-card p {
    margin: 0 0 20px 0;
    color: #666;
}

/* Promo specific styles */
.promo-setting-item {
    margin-bottom: 25px;
}

.promo-setting-item label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: #333;
}

.slider-container {
    display: flex;
    align-items: center;
    gap: 15px;
}

.slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 10px;
    background: #ddd;
    outline: none;
    border-radius: 5px;
    opacity: 0.7;
    transition: opacity .2s;
}

.slider:hover {
    opacity: 1;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    background: #ff6b6b;
    cursor: pointer;
    border-radius: 50%;
}

.slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
    background: #ff6b6b;
    cursor: pointer;
    border-radius: 50%;
}

.slider-value {
    font-weight: bold;
    color: #ff6b6b;
}

.input-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.input-group span {
    font-weight: 500;
}

.input-group input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    text-align: center;
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