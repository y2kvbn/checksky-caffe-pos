<template>
  <div class="promotions">
    <h2>優惠活動</h2>
    <!-- 檢查資料是否存在，如果不存在則顯示讀取中或提示 -->
    <div v-if="singleItemDeal && spendAndGet && spendAndDiscount" class="promotion-cards">
      <!-- 單項優惠價 -->
      <div class="promotion-card">
        <div class="card-header">
          <h3>單項優惠價</h3>
          <label class="switch">
            <!-- v-model 現在直接綁定到 computed property 的 enabled 屬性 -->
            <input type="checkbox" v-model="singleItemDeal.enabled">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="card-body">
          <p>設定特定品項的優惠價格。</p>
          <div v-if="singleItemDeal.enabled" class="settings">
            <select v-model="singleItemDeal.itemId">
              <option disabled value="">請選擇品項</option>
              <option v-for="item in menuStore.items" :key="item.id" :value="item.id">
                {{ item.name }} - NT${{ item.price }}
              </option>
            </select>
            <input type="number" placeholder="優惠價格" v-model.number="singleItemDeal.discountPrice">
          </div>
        </div>
      </div>

      <!-- 滿額贈送 -->
      <div class="promotion-card">
        <div class="card-header">
          <h3>滿額贈送</h3>
          <label class="switch">
            <input type="checkbox" v-model="spendAndGet.enabled">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="card-body">
          <p>消費滿額即可獲得贈品。</p>
          <div v-if="spendAndGet.enabled" class="settings">
            <input type="number" placeholder="消費門檻" v-model.number="spendAndGet.threshold">
            <input type="text" placeholder="贈品名稱" v-model="spendAndGet.giftName">
          </div>
        </div>
      </div>

      <!-- 滿額打折 -->
      <div class="promotion-card">
        <div class="card-header">
          <h3>滿額打折</h3>
          <label class="switch">
            <input type="checkbox" v-model="spendAndDiscount.enabled">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="card-body">
          <p>消費滿額即可享有折扣。</p>
          <div v-if="spendAndDiscount.enabled" class="settings">
            <input type="number" placeholder="消費門檻" v-model.number="spendAndDiscount.threshold">
            <input type="number" placeholder="折扣(例如: 85折請輸入85)" v-model.number="spendAndDiscount.discount">
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>正在讀取優惠活動設定...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePromotionsStore, type Promotion } from '@/stores/promotions';
import { useMenuStore } from '@/stores/menu';

const promotionsStore = usePromotionsStore();
const menuStore = useMenuStore();

// 核心改動：建立 "Adapter" (適配器)
// 這個 computed property 會從新的 promotions 陣列中，找到第一個符合條件的活動
// 這樣 template 就可以繼續使用舊的變數名稱 (singleItemDeal)
const singleItemDeal = computed(() => {
  // 找到類型為 'SINGLE_ITEM_DEAL' 的第一個活動
  // ?. 語法確保即使找不到活動，也不會產生錯誤
  return promotionsStore.promotions.find(p => p.type === 'SINGLE_ITEM_DEAL');
});

const spendAndGet = computed(() => {
  return promotionsStore.promotions.find(p => p.type === 'SPEND_AND_GET');
});

const spendAndDiscount = computed(() => {
  return promotionsStore.promotions.find(p => p.type === 'SPEND_AND_DISCOUNT');
});

// 因為我們直接修改 computed property 回傳的物件屬性 (例如 singleItemDeal.value.enabled)，
// Vue 的響應式系統會追蹤到這個變更，並更新到 Pinia store 中。
// Pinia store 裡的 watch 會自動將更新後的狀態儲存到 localStorage。
// 所以我們不需要像以前一樣從 storeToRefs 解構，也不需要手動呼叫 update action。

</script>

<style scoped>
/* 樣式完全維持原樣，不做任何變更 */
.promotions h2 {
  font-size: 28px;
  margin-bottom: 25px;
  color: #333;
}

.promotion-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.promotion-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.promotion-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 20px;
}

.card-body {
  padding: 20px;
}

.card-body p {
    margin-top: 0;
    color: #666;
}

.settings {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.settings input, .settings select {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.settings input:focus, .settings select:focus {
    outline: none;
    border-color: #4eb8d7;
    box-shadow: 0 0 0 3px rgba(78, 184, 215, 0.2);
}

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

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #4eb8d7;
}

input:focus + .slider {
  box-shadow: 0 0 1px #4eb8d7;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>