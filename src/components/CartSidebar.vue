<template>
  <aside class="cart-sidebar">
    <div class="cart">
      <h2>我的購物車</h2>
      <div class="cart-body">
        <div v-if="cartItems.length === 0" class="cart-empty">
          <p>購物車是空的</p>
        </div>
        <div v-else class="cart-items">
          <div class="cart-item" v-for="item in cartItems" :key="item.cartItemId">
            <div class="item-info-cart">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-price" :class="{ 'original-price': item.discountedPrice && item.discountedPrice !== item.price }">NT${{ item.price }}</span>
              <span v-if="item.discountedPrice && item.discountedPrice !== item.price" class="discounted-price">NT${{ item.discountedPrice }}</span>
            </div>
            <div class="item-quantity-controls">
              <button @click="$emit('decreaseQuantity', item)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="$emit('increaseQuantity', item)">+</button>
            </div>
          </div>
        </div>
      </div>
      <div class="cart-summary">
        
        <div v-if="promotionHints.length > 0" class="promo-hints-container">
            <div v-for="hint in promotionHints" :key="hint" class="promo-message hint">
                <p>💡 {{ hint }}</p>
            </div>
        </div>

        <div class="summary-item">
          <span>小計:</span>
          <span>NT${{ subtotal }}</span>
        </div>

        <div v-if="appliedDeals.length > 0" class="promo-messages-container">
            <div v-for="deal in appliedDeals" :key="deal" class="promo-message discount">
                <p>🎉 已套用: {{ deal }}</p>
            </div>
        </div>
        
        <div v-if="gifts.length > 0" class="promo-messages-container">
            <div v-for="gift in gifts" :key="gift" class="promo-message gift">
                <p>🎁 恭喜獲得: {{ gift }}</p>
            </div>
        </div>

        <div class="summary-total">
          <span>總計:</span>
          <span>NT${{ total }}</span>
        </div>
        <button class="btn btn-confirm" @click="$emit('checkout')" :disabled="!selectedTable || cartItems.length === 0">前往結帳</button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  cartItems: any[],
  subtotal: number,
  total: number,
  appliedDeals: string[],
  gifts: string[],
  promotionHints: string[],
  selectedTable: any,
}>();

defineEmits(['decreaseQuantity', 'increaseQuantity', 'checkout']);

</script>

<style scoped>
/* ... (其餘樣式不變) ... */

.cart-sidebar {
  width: 350px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.cart {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
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

.promo-messages-container, .promo-hints-container {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.promo-message {
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
}

.promo-message.hint {
  background-color: #e6f7ff;
  border-left: 4px solid #1890ff;
  color: #0050b3;
}

.promo-message.hint p {
  margin: 0;
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

/* --- Checkout Button Redesign --- */
.btn-confirm {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  justify-content: center;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  /* Main Action Color */
  background-color: #FF6A3D;
  color: #FFFFFF;
  box-shadow: 0 4px 15px rgba(255, 106, 61, 0.4);
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 106, 61, 0.6);
}

.btn-confirm:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 106, 61, 0.4);
}

.btn-confirm:disabled {
  background-color: #E5E7EB; /* Softer gray for disabled state */
  color: #9CA3AF;
  box-shadow: none;
  cursor: not-allowed;
}
</style>
