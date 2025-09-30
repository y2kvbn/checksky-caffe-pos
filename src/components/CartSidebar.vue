<template>
  <aside class="cart-sidebar">
    <div class="cart">
      <h2>我的購物車</h2>
      <div class="table-selection-wrapper">
        <div v-if="selectedTable" class="table-display">
          <span>桌號: <strong>{{ selectedTable.name }}</strong></span>
          <button @click="emit('openTableModal')">更換</button>
        </div>
        <button v-else class="btn btn-secondary" @click="emit('openTableModal')">&#128442; 選擇桌號</button>
      </div>
      <div class="cart-body">
        <div v-if="cart.length === 0" class="cart-empty">
          <p>購物車是空的</p>
        </div>
        <div v-else class="cart-items">
          <div class="cart-item" v-for="item in cartWithPromotions" :key="item.cartItemId">
            <div class="item-info-cart">
              <span class="item-name">{{ item.name }} <span v-if="item.isGift" class="gift-tag">[贈品]</span></span>
              <span class="item-price" :class="{ 'original-price': item.discountedPrice !== item.price }">NT${{ item.price }}</span>
              <span v-if="item.discountedPrice !== item.price" class="discounted-price">NT${{ item.discountedPrice }}</span>
            </div>
            <div class="item-quantity-controls">
              <button @click="emit('decreaseQuantity', item)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="emit('increaseQuantity', item)">+</button>
            </div>
          </div>
        </div>
      </div>
      <div class="cart-summary">
        <div class="summary-item">
          <span>小計:</span>
          <span>NT${{ subtotal }}</span>
        </div>
        <div class="promo-messages-container">
          <div v-if="spendAndDiscountMessage" class="promo-message discount">
            <p>&#127881; {{ spendAndDiscountMessage }}</p>
          </div>
          <div v-if="spendAndGetMessage" class="promo-message gift">
            <p>&#127873; {{ spendAndGetMessage }} <span v-if="isGiftThresholdMet" class="gift-achieved">(已達成)</span></p>
          </div>
        </div>
        <div class="summary-total">
          <span>總計:</span>
          <span>NT${{ total }}</span>
        </div>
        <button class="btn btn-confirm" @click="emit('checkout')" :disabled="!selectedTable">前往結帳</button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePromotionsStore } from '../stores/promotions';
import { storeToRefs } from 'pinia';

const props = defineProps<{ 
  cart: any[], 
  selectedTable: any 
}>();

const emit = defineEmits(['openTableModal', 'decreaseQuantity', 'increaseQuantity', 'checkout']);

const promotionsStore = usePromotionsStore();
const { singleItemDeal, spendAndGet, spendAndDiscount } = storeToRefs(promotionsStore);

const subtotal = computed(() => {
  return props.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const cartWithPromotions = computed(() => {
  let processedCart = props.cart.map(item => ({
    ...item,
    discountedPrice: item.price
  }));

  if (singleItemDeal.value.enabled && singleItemDeal.value.itemId) {
    processedCart.forEach(item => {
      if (item.id === singleItemDeal.value.itemId) {
        item.discountedPrice = singleItemDeal.value.discountPrice;
      }
    });
  }

  return processedCart;
});

const cartSubtotalAfterSingleItemDiscount = computed(() => {
  return cartWithPromotions.value.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
});

const isDiscountThresholdMet = computed(() => {
  return spendAndDiscount.value.enabled && cartSubtotalAfterSingleItemDiscount.value >= spendAndDiscount.value.threshold;
});

const spendAndDiscountMessage = computed(() => {
  if (!spendAndDiscount.value.enabled) return '';
  return `滿${spendAndDiscount.value.threshold}元享${spendAndDiscount.value.discount}折優惠。`;
});

const isGiftThresholdMet = computed(() => {
  return spendAndGet.value.enabled && cartSubtotalAfterSingleItemDiscount.value >= spendAndGet.value.threshold;
});

const spendAndGetMessage = computed(() => {
  if (!spendAndGet.value.enabled) return '';
  return `滿${spendAndGet.value.threshold}元贈送${spendAndGet.value.giftName}。`;
});

const total = computed(() => {
  let finalTotal = cartSubtotalAfterSingleItemDiscount.value;

  if (isDiscountThresholdMet.value) {
    const discountMultiplier = 1 - (spendAndDiscount.value.discount / 100);
    finalTotal *= discountMultiplier;
  }

  return Math.round(finalTotal);
});
</script>

<style scoped>
.cart-sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  /* Magic fix for flex/grid children */
}

.cart {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.cart h2 {
  font-size: 22px;
  color: var(--text-dark);
  margin: 0 0 20px 0;
  text-align: center;
  flex-shrink: 0;
}

.cart-body {
  flex-grow: 1;
  overflow-y: auto;
  margin: 0 -15px;
  padding: 0 15px;
}

.cart-empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-light);
}

.cart-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.item-info-cart .item-name {
  font-weight: 600;
  font-size: 16px;
}

.item-info-cart .original-price {
  text-decoration: line-through;
  color: var(--text-light);
  font-size: 14px;
  margin-left: 10px;
}

.item-info-cart .discounted-price {
  color: var(--primary-color);
  font-weight: bold;
  font-size: 16px;
  margin-left: 8px;
}

.item-quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-quantity-controls button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background-color: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.item-quantity-controls button:hover {
  background-color: #f0f0f0;
}

.cart-summary {
  border-top: 2px solid var(--border-color);
  padding-top: 20px;
  flex-shrink: 0;
}

.summary-item,
.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-bottom: 12px;
}

.summary-total {
  font-size: 26px;
  font-weight: bold;
  color: var(--text-dark);
}

.promo-messages-container {
  margin: 15px 0;
}

.promo-message {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.5;
}

.promo-message.discount {
  background-color: #e6fffa;
  border-left: 4px solid #38b2ac;
  color: #2c5282;
}

.promo-message.gift {
  background-color: #fff5e6;
  border-left: 4px solid #f6ad55;
  color: #9c4221;
}

.gift-achieved {
  color: #38a169;
  font-weight: bold;
  margin-left: 5px;
}

.btn-confirm {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  justify-content: center;
  background-color: var(--secondary-color);
  color: var(--text-dark);
}

.btn-confirm:hover {
  opacity: 0.9;
}

.btn-confirm:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.table-selection-wrapper {
  padding-bottom: 15px;
  margin-bottom: 15px;
  text-align: center;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color);
}

.table-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f7f7;
  padding: 10px 15px;
  border-radius: 8px;
}

.table-display span {
  font-size: 1rem;
  color: #333;
}

.table-display button {
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 5px;
  background-color: #e0e0e0;
  cursor: pointer;
  border: none;
}

.btn {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    font-weight: bold;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-secondary {
    background-color: #a0aec0;
    color: white;
}
</style>
