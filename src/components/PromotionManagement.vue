<template>
  <div class="promotions">
    <h2>優惠活動</h2>
    <div v-if="singleItemDeal && spendAndGet && spendAndDiscount" class="promotion-cards">
      <!-- 單項優惠價 - 现在占据整个顶行 -->
      <div class="promotion-card single-item-deal-card">
        <div class="card-header">
          <h3>單項優惠價</h3>
          <label class="switch">
            <input type="checkbox" v-model="singleItemDeal.enabled">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="card-body">
          <p>設定特定品項的優惠價格。</p>
          <div v-if="singleItemDeal.enabled" class="settings">
            <div class="item-selectors">
              <select v-model="singleItemDeal.itemIds[0]">
                <option disabled value="">請選擇品項 1</option>
                <option v-for="item in menuStore.items" :key="item.id" :value="item.id">
                  {{ item.name }} - NT${{ item.price }}
                </option>
              </select>
              <select v-model="singleItemDeal.itemIds[1]">
                <option disabled value="">請選擇品項 2</option>
                <option v-for="item in menuStore.items" :key="item.id" :value="item.id">
                  {{ item.name }} - NT${{ item.price }}
                </option>
              </select>
            </div>
            <input type="number" placeholder="優惠價格" v-model.number="singleItemDeal.discountPrice">
          </div>
        </div>
      </div>

      <!-- 满额赠送 -->
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

      <!-- 满额打折 -->
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
import { computed, watch } from 'vue';
import { usePromotionsStore } from '@/stores/promotions';
import { useMenuStore } from '@/stores/menu';

const promotionsStore = usePromotionsStore();
const menuStore = useMenuStore();

const singleItemDeal = computed(() => {
  return promotionsStore.promotions.find(p => p.type === 'SINGLE_ITEM_DEAL');
});

const spendAndGet = computed(() => {
  return promotionsStore.promotions.find(p => p.type === 'SPEND_AND_GET');
});

const spendAndDiscount = computed(() => {
  return promotionsStore.promotions.find(p => p.type === 'SPEND_AND_DISCOUNT');
});

watch(singleItemDeal, (deal) => {
  if (deal && !Array.isArray(deal.itemIds)) {
    deal.itemIds = deal.itemId ? [deal.itemId] : [null, null];
  }
  if (deal && deal.itemIds.length < 2) {
     deal.itemIds.push(null);
  }
}, { immediate: true });

</script>

<style scoped>
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

.item-selectors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.settings input, .settings select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  box-sizing: border-box; /* [FIX] Prevents overflow */
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
