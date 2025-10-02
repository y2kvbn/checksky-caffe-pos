<template>
  <div class="promotions">
    <h2>優惠活動</h2>
    <!-- [FIX-4.2] v-if 條件更新，確保所有 localPromotions 都已載入 -->
    <div v-if="localPromotions.singleItemDeal && localPromotions.spendAndGet && localPromotions.spendAndDiscount" class="promotion-cards">
      <!-- 單項優惠價 -->
      <div class="promotion-card single-item-deal-card">
        <div class="card-header">
          <h3>單項優惠價</h3>
          <label class="switch">
            <input type="checkbox" v-model="localPromotions.singleItemDeal.enabled">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="card-body">
          <p>為特定品項設定獨立的優惠價格。</p>
          <!-- [FIX-4.2] 重構 UI 以對應新的資料結構 -->
          <div v-if="localPromotions.singleItemDeal.enabled" class="settings">
            <!-- 第一個品項設定 -->
            <div class="deal-item-setting">
              <select v-model="localPromotions.singleItemDeal.items[0].itemId">
                <option :value="null">請選擇品項 1</option>
                <option v-for="item in menuStore.items" :key="'deal1-' + item.id" :value="item.id">
                  {{ item.name }} - NT${{ item.price }}
                </option>
              </select>
              <input type="number" placeholder="品項1 優惠價" v-model.number="localPromotions.singleItemDeal.items[0].discountPrice">
            </div>
            <!-- 第二個品項設定 -->
            <div class="deal-item-setting">
              <select v-model="localPromotions.singleItemDeal.items[1].itemId">
                <option :value="null">請選擇品項 2 (可選)</option>
                <option v-for="item in menuStore.items" :key="'deal2-' + item.id" :value="item.id">
                  {{ item.name }} - NT${{ item.price }}
                </option>
              </select>
              <input type="number" placeholder="品項2 優惠價" v-model.number="localPromotions.singleItemDeal.items[1].discountPrice">
            </div>
          </div>
        </div>
      </div>

      <!-- 滿額贈送 -->
      <div class="promotion-card">
        <div class="card-header">
          <h3>滿額贈送</h3>
          <label class="switch">
            <input type="checkbox" v-model="localPromotions.spendAndGet.enabled">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="card-body">
          <p>消費滿額即可獲得贈品。</p>
          <div v-if="localPromotions.spendAndGet.enabled" class="settings">
            <input type="number" placeholder="消費門檻" v-model.number="localPromotions.spendAndGet.threshold">
            <input type="text" placeholder="贈品名稱" v-model="localPromotions.spendAndGet.giftName">
          </div>
        </div>
      </div>

      <!-- 滿額打折 -->
      <div class="promotion-card">
        <div class="card-header">
          <h3>滿額打折</h3>
          <label class="switch">
            <input type="checkbox" v-model="localPromotions.spendAndDiscount.enabled">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="card-body">
          <p>消費滿額即可享有折扣。</p>
          <div v-if="localPromotions.spendAndDiscount.enabled" class="settings">
            <input type="number" placeholder="消費門檻" v-model.number="localPromotions.spendAndDiscount.threshold">
            <input type="number" placeholder="折扣(例如: 85折請輸入85)" v-model.number="localPromotions.spendAndDiscount.discount">
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
import { ref, watch, reactive } from 'vue';
import { usePromotionsStore, type Promotion, type SingleItemDeal, type SpendAndDiscount, type SpendAndGet, type DealItem } from '@/stores/promotions';
import { useMenuStore } from '@/stores/menu';
import { storeToRefs } from 'pinia';
import { cloneDeep, debounce } from 'lodash-es';

const promotionsStore = usePromotionsStore();
const menuStore = useMenuStore();
const { promotions } = storeToRefs(promotionsStore);

// [FIX-4.2] 更新 localPromotions 的結構
const localPromotions = reactive<{
  singleItemDeal: SingleItemDeal | null;
  spendAndGet: SpendAndGet | null;
  spendAndDiscount: SpendAndDiscount | null;
}>({ 
  singleItemDeal: null,
  spendAndGet: null,
  spendAndDiscount: null,
});

watch(promotions, (newPromotions) => {
  const singleDeal = newPromotions.find(p => p.type === 'SINGLE_ITEM_DEAL') as SingleItemDeal | undefined;
  const spendGet = newPromotions.find(p => p.type === 'SPEND_AND_GET') as SpendAndGet | undefined;
  const spendDiscount = newPromotions.find(p => p.type === 'SPEND_AND_DISCOUNT') as SpendAndDiscount | undefined;
  
  // 使用 cloneDeep 確保從 store 來的資料是全新的複本
  localPromotions.singleItemDeal = singleDeal ? cloneDeep(singleDeal) : null;
  localPromotions.spendAndGet = spendGet ? cloneDeep(spendGet) : null;
  localPromotions.spendAndDiscount = spendDiscount ? cloneDeep(spendDiscount) : null;

}, { deep: true, immediate: true });

// [FIX-4.2] 更新 debounce 邏輯，以處理整個巢狀結構的變動
const updateStore = debounce(() => {
  if(localPromotions.singleItemDeal && localPromotions.singleItemDeal.id){
     promotionsStore.updatePromotion(localPromotions.singleItemDeal.id, cloneDeep(localPromotions.singleItemDeal));
  }
   if(localPromotions.spendAndGet && localPromotions.spendAndGet.id){
     promotionsStore.updatePromotion(localPromotions.spendAndGet.id, cloneDeep(localPromotions.spendAndGet));
  }
   if(localPromotions.spendAndDiscount && localPromotions.spendAndDiscount.id){
     promotionsStore.updatePromotion(localPromotions.spendAndDiscount.id, cloneDeep(localPromotions.spendAndDiscount));
  }
}, 500);

// 監聽整個 localPromotions 物件的深度變化
watch(localPromotions, (newVal) => {
  if(newVal) {
    updateStore();
  }
}, { deep: true });

</script>

<style scoped>
/* [NEW] 新增 deal-item-setting 樣式 */
.deal-item-setting {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
  align-items: center;
}

.promotions h2 {
  font-size: 28px;
  margin-bottom: 25px;
  color: #333;
}

.promotion-cards {
  display: grid;
  grid-template-columns: 1fr 1fr; 
  gap: 25px;
}

.single-item-deal-card {
  grid-column: 1 / -1; 
}

.promotion-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex; 
  flex-direction: column; 
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
  flex-grow: 1; 
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
  width: 100%;
  box-sizing: border-box; 
}

.settings input:focus, .settings select:focus {
  outline: none;
  border-color: #4eb8d7;
  box-shadow: 0 0 0 3px rgba(78, 184, 215, 0.2);
}

.switch { position: relative; display: inline-block; width: 50px; height: 28px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
.slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
input:checked + .slider { background-color: #4eb8d7; }
input:focus + .slider { box-shadow: 0 0 1px #4eb8d7; }
input:checked + .slider:before { transform: translateX(22px); }
.slider.round { border-radius: 34px; }
.slider.round:before { border-radius: 50%; }
</style>